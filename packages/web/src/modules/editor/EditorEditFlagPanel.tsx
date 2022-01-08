import {
    Grid,
    GridItem,
    Icon,
    IconButton,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
} from "@chakra-ui/react";
import {
    FLAG_BORDER_RADIUS_UPPER_LOWER,
    FLAG_BORDER_WIDTH_UPPER_LOWER,
    FLAG_PADDING_UPPER_LOWER,
} from "@flagstrips/common";
import produce from "immer";
import { clamp, mapValues, ObjectIterator } from "lodash";
import { useCallback, useEffect, useState } from "react";
import {
    HiOutlineArrowSmDown,
    HiOutlineArrowSmLeft,
    HiOutlineArrowSmRight,
    HiOutlineArrowSmUp,
    HiOutlineLink,
} from "react-icons/hi";
import { MdBorderStyle, MdOutlineRoundedCorner } from "react-icons/md";
import { ValueOf } from "type-fest";
import ColorInput from "../ui/ColorInput";
import {
    ConstrainProportionsFlag,
    EditFlagForm,
    getFlagPostByFormValues,
    getFormValuesByFlag,
    isEditFlagFormPaddingKey,
} from "./edit-flag";
import { useEditorStore } from "./useEditor";

const EditorEditFlagPanel: React.FC = () => {
    const { selectedFlag, updateSelectedFlag } = useEditorStore();

    const [formValues, setFormValues] = useState<EditFlagForm>();
    //Used so that an update is not unnecessarily sent when the form values are first set.
    const [shouldUpdateFlag, setShouldUpdateFlag] = useState(false);

    const [constrainProportions, setConstrainProportions] = useState<ConstrainProportionsFlag>({});

    const clampFormValue = useCallback(
        (key: keyof EditFlagForm, value: ValueOf<EditFlagForm>): ValueOf<EditFlagForm> => {
            if (isEditFlagFormPaddingKey(key))
                return clamp(value as number, FLAG_PADDING_UPPER_LOWER.lower, FLAG_PADDING_UPPER_LOWER.upper);

            switch (key) {
                case "borderRadius":
                    return clamp(
                        value as number,
                        FLAG_BORDER_RADIUS_UPPER_LOWER.lower,
                        FLAG_BORDER_RADIUS_UPPER_LOWER.upper,
                    );
                case "borderWidth":
                    return clamp(
                        value as number,
                        FLAG_BORDER_WIDTH_UPPER_LOWER.lower,
                        FLAG_BORDER_WIDTH_UPPER_LOWER.upper,
                    );
            }
            return value;
        },
        [],
    );

    const clampFormValues = useCallback(
        (formValues: EditFlagForm): EditFlagForm => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const iterate: ObjectIterator<EditFlagForm, any> = (value, key) => {
                if (typeof value === "object") return mapValues(value, iterate);
                return clampFormValue(key as keyof EditFlagForm, value);
            };
            return mapValues(formValues, iterate);
        },
        [formValues],
    );

    const handleBlur = useCallback(
        (key: keyof EditFlagForm) =>
            setFormValues(
                produce((draftState) => {
                    if (draftState) {
                        const value = draftState[key];
                        if (typeof value === "number" && isNaN(value)) {
                            // This never cast is hacky but works. There is an issue with the compiler and handling key/value pairs.
                            const clampedValue = clampFormValue(key, 0) as never;
                            draftState[key] = clampedValue;

                            if (isEditFlagFormPaddingKey(key)) {
                                if (constrainProportions.paddingX) {
                                    switch (key) {
                                        case "paddingLeft":
                                            draftState.paddingRight = clampedValue;
                                            break;
                                        case "paddingRight":
                                            draftState.paddingLeft = clampedValue;
                                            break;
                                    }
                                }
                                if (constrainProportions.paddingY) {
                                    switch (key) {
                                        case "paddingTop":
                                            draftState.paddingBottom = clampedValue;
                                            break;
                                        case "paddingBottom":
                                            draftState.paddingTop = clampedValue;
                                            break;
                                    }
                                }
                            }
                        }
                    }
                }),
            ),
        [constrainProportions],
    );

    const handleChangeValue = useCallback(
        <Key extends keyof EditFlagForm>(key: Key, value: EditFlagForm[Key]) => {
            setFormValues(
                produce((draftState) => {
                    if (draftState) {
                        draftState[key] = value;

                        if (constrainProportions.paddingX) {
                            switch (key) {
                                case "paddingLeft":
                                    draftState.paddingRight =
                                        constrainProportions.paddingX === 1
                                            ? draftState.paddingLeft
                                            : Math.ceil((value as number) * constrainProportions.paddingX);
                                    break;
                                case "paddingRight":
                                    draftState.paddingLeft =
                                        constrainProportions.paddingX === 1
                                            ? draftState.paddingRight
                                            : Math.ceil((value as number) * constrainProportions.paddingX);
                                    break;
                            }
                        }
                        if (constrainProportions.paddingY) {
                            switch (key) {
                                case "paddingTop":
                                    draftState.paddingBottom =
                                        constrainProportions.paddingY === 1
                                            ? draftState.paddingTop
                                            : Math.ceil((value as number) * constrainProportions.paddingY);
                                    break;
                                case "paddingBottom":
                                    draftState.paddingTop =
                                        constrainProportions.paddingY === 1
                                            ? draftState.paddingBottom
                                            : Math.ceil((value as number) * constrainProportions.paddingY);
                                    break;
                            }
                        }
                    }
                }),
            );
        },
        [constrainProportions],
    );

    const handleChangeEvent = useCallback(
        (key: keyof EditFlagForm, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { value } = e.target;

            if (!isNaN(+value)) handleChangeValue(key, Number(value));
            else {
                // handleChangeValue(key, value);
            }
        },
        [],
    );

    const sanitizePaddingRatio = useCallback(
        (ratio: number): number => (ratio === Infinity || isNaN(ratio) ? 1 : ratio),
        [],
    );

    const onConstrainProportions = useCallback(
        (constrain: keyof ConstrainProportionsFlag) => {
            setConstrainProportions(
                produce((draftState) => {
                    if (!draftState[constrain] && formValues) {
                        switch (constrain) {
                            case "paddingX": {
                                const { paddingLeft, paddingRight } = formValues;
                                const ratio =
                                    paddingLeft > paddingRight
                                        ? paddingLeft / paddingRight
                                        : paddingRight / paddingLeft;

                                draftState[constrain] = sanitizePaddingRatio(ratio);
                                break;
                            }
                            case "paddingY": {
                                const { paddingTop, paddingBottom } = formValues;
                                const ratio =
                                    paddingTop > paddingBottom
                                        ? paddingTop / paddingBottom
                                        : paddingBottom / paddingTop;

                                draftState[constrain] = sanitizePaddingRatio(ratio);
                                break;
                            }
                        }
                    } else if (draftState[constrain]) {
                        draftState[constrain] = undefined;
                    }
                }),
            );
        },
        [formValues],
    );

    useEffect(() => {
        if (formValues && shouldUpdateFlag && selectedFlag) {
            const clampedFormValues = clampFormValues(formValues);
            if (EditFlagForm.safeParse(clampedFormValues).success)
                updateSelectedFlag(getFlagPostByFormValues(clampedFormValues));
        }
        setShouldUpdateFlag(true);
    }, [formValues]);

    useEffect(() => {
        if (selectedFlag && !formValues) {
            setShouldUpdateFlag(false);
            setFormValues(getFormValuesByFlag(selectedFlag));
        } else if (!selectedFlag && formValues) {
            setShouldUpdateFlag(true);
            setFormValues(undefined);
        }
    }, [selectedFlag, formValues]);

    return formValues ? (
        <>
            <Text textStyle="editorHeader" marginBottom={1}>
                padding
            </Text>
            <Grid templateColumns="auto auto 1fr" rowGap={1} columnGap={2} alignItems="end" marginBottom={3}>
                <GridItem display="flex" flexDirection="row" alignItems="center">
                    <Icon as={HiOutlineArrowSmUp} marginEnd={1} />
                    <NumberInput
                        size="xs"
                        min={FLAG_PADDING_UPPER_LOWER.lower}
                        max={FLAG_PADDING_UPPER_LOWER.upper}
                        value={!isNaN(formValues.paddingTop) ? formValues.paddingTop : ""}
                        onChange={(_, value) => handleChangeValue("paddingTop", value)}
                        onBlur={() => handleBlur("paddingTop")}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </GridItem>
                <GridItem display="flex" flexDirection="row" alignItems="center">
                    <Icon as={HiOutlineArrowSmDown} marginEnd={1} />
                    <NumberInput
                        size="xs"
                        value={!isNaN(formValues.paddingBottom) ? formValues.paddingBottom : ""}
                        onChange={(_, value) => handleChangeValue("paddingBottom", value)}
                        onBlur={() => handleBlur("paddingBottom")}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </GridItem>
                <GridItem>
                    <IconButton
                        size="xs"
                        aria-label="Constrain proportions"
                        icon={<HiOutlineLink />}
                        variant="ghost"
                        isActive={!!constrainProportions.paddingY}
                        onClick={() => onConstrainProportions("paddingY")}
                    />
                </GridItem>
                <GridItem display="flex" flexDirection="row" alignItems="center">
                    <Icon as={HiOutlineArrowSmLeft} marginEnd={1} />
                    <NumberInput
                        size="xs"
                        value={!isNaN(formValues.paddingLeft) ? formValues.paddingLeft : ""}
                        onChange={(_, value) => handleChangeValue("paddingLeft", value)}
                        onBlur={() => handleBlur("paddingLeft")}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </GridItem>
                <GridItem display="flex" flexDirection="row" alignItems="center">
                    <Icon as={HiOutlineArrowSmRight} marginEnd={1} />
                    <NumberInput
                        size="xs"
                        value={!isNaN(formValues.paddingRight) ? formValues.paddingRight : ""}
                        onChange={(_, value) => handleChangeValue("paddingRight", value)}
                        onBlur={() => handleBlur("paddingRight")}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </GridItem>
                <GridItem>
                    <IconButton
                        size="xs"
                        aria-label="Constrain proportions"
                        icon={<HiOutlineLink />}
                        variant="ghost"
                        isActive={!!constrainProportions.paddingX}
                        onClick={() => onConstrainProportions("paddingX")}
                    />
                </GridItem>
            </Grid>
            <Text textStyle="editorHeader" marginBottom={1}>
                border
            </Text>
            <Grid templateColumns="1fr 1fr 1fr" gridGap={1} alignItems="end" marginBottom={3}>
                <GridItem display="flex" flexDirection="row" alignItems="center">
                    <Icon as={MdBorderStyle} marginEnd={1} />
                    <NumberInput
                        size="xs"
                        min={FLAG_BORDER_WIDTH_UPPER_LOWER.lower}
                        max={FLAG_BORDER_WIDTH_UPPER_LOWER.upper}
                        value={!isNaN(formValues.borderWidth) ? formValues.borderWidth : ""}
                        onChange={(_, value) => handleChangeValue("borderWidth", value)}
                        onBlur={() => handleBlur("borderWidth")}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </GridItem>
                <GridItem display="flex" flexDirection="row" alignItems="center">
                    <Icon as={MdOutlineRoundedCorner} transform="rotate(270deg)" marginX={1} />
                    <NumberInput
                        size="xs"
                        min={FLAG_BORDER_RADIUS_UPPER_LOWER.lower}
                        max={FLAG_BORDER_RADIUS_UPPER_LOWER.upper}
                        value={!isNaN(formValues.borderRadius) ? formValues.borderRadius : ""}
                        onChange={(_, value) => handleChangeValue("borderRadius", value)}
                        onBlur={() => handleBlur("borderRadius")}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </GridItem>
                <GridItem>
                    <ColorInput
                        size="xs"
                        value={formValues.borderColor}
                        onHexChange={(hex) => handleChangeValue("borderColor", hex)}
                    />
                </GridItem>
            </Grid>
        </>
    ) : (
        <></>
    );
};

export default EditorEditFlagPanel;
