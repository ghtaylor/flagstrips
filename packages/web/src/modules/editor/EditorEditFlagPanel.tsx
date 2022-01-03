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
import { FLAG_PADDING_UPPER_LOWER } from "@flagstrips/common";
import produce from "immer";
import { clamp, mapValues, ObjectIterator } from "lodash";
import { useCallback, useEffect, useState } from "react";
import {
    HiOutlineArrowNarrowDown,
    HiOutlineArrowNarrowLeft,
    HiOutlineArrowNarrowRight,
    HiOutlineArrowNarrowUp,
    HiOutlineLink,
} from "react-icons/hi";
import { ValueOf } from "type-fest";
import {
    ConstrainProportionsFlagPadding,
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

    const [constrainProportions, setConstrainProportions] = useState<ConstrainProportionsFlagPadding>({});

    const clampFormValue = useCallback(
        (key: keyof EditFlagForm, value: ValueOf<EditFlagForm>): ValueOf<EditFlagForm> => {
            if (isEditFlagFormPaddingKey(key))
                return clamp(value, FLAG_PADDING_UPPER_LOWER.lower, FLAG_PADDING_UPPER_LOWER.upper);
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
        (key: keyof EditFlagForm) => {
            if (isEditFlagFormPaddingKey(key))
                setFormValues(
                    produce((draftState) => {
                        if (draftState) {
                            if (isNaN(draftState[key])) {
                                draftState[key] = 0;

                                if (constrainProportions.x) {
                                    switch (key) {
                                        case "paddingLeft":
                                            draftState.paddingRight = 0;
                                            break;
                                        case "paddingRight":
                                            draftState.paddingLeft = 0;
                                            break;
                                    }
                                }
                                if (constrainProportions.y) {
                                    switch (key) {
                                        case "paddingTop":
                                            draftState.paddingBottom = 0;
                                            break;
                                        case "paddingBottom":
                                            draftState.paddingTop = 0;
                                            break;
                                    }
                                }
                            }
                        }
                    }),
                );
        },
        [constrainProportions],
    );

    const handleChangeValue = useCallback(
        <Key extends keyof EditFlagForm>(key: Key, value: EditFlagForm[Key]) => {
            setFormValues(
                produce((draftState) => {
                    if (draftState) {
                        draftState[key] = value;

                        if (constrainProportions.x) {
                            switch (key) {
                                case "paddingLeft":
                                    draftState.paddingRight =
                                        constrainProportions.x === 1
                                            ? draftState.paddingLeft
                                            : Math.ceil(value * constrainProportions.x);
                                    break;
                                case "paddingRight":
                                    draftState.paddingLeft =
                                        constrainProportions.x === 1
                                            ? draftState.paddingRight
                                            : Math.ceil(value * constrainProportions.x);
                                    break;
                            }
                        }
                        if (constrainProportions.y) {
                            switch (key) {
                                case "paddingTop":
                                    draftState.paddingBottom =
                                        constrainProportions.y === 1
                                            ? draftState.paddingTop
                                            : Math.ceil(value * constrainProportions.y);
                                    break;
                                case "paddingBottom":
                                    draftState.paddingTop =
                                        constrainProportions.y === 1
                                            ? draftState.paddingBottom
                                            : Math.ceil(value * constrainProportions.y);
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

    const onConstrainProportions = useCallback(
        (axis: "x" | "y") => {
            setConstrainProportions(
                produce((draftState) => {
                    if (!draftState[axis] && formValues) {
                        const { paddingTop, paddingBottom, paddingLeft, paddingRight } = formValues;
                        let ratio: number;
                        switch (axis) {
                            case "x":
                                ratio =
                                    paddingLeft > paddingRight
                                        ? paddingLeft / paddingRight
                                        : paddingRight / paddingLeft;
                                break;

                            case "y":
                                ratio =
                                    paddingTop > paddingBottom
                                        ? paddingTop / paddingBottom
                                        : paddingBottom / paddingTop;
                                break;
                        }
                        if (ratio === Infinity || isNaN(ratio)) ratio = 1;
                        draftState[axis] = ratio;
                    } else delete draftState[axis];
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
            <Grid templateColumns="auto auto 1fr" rowGap={1} columnGap={2} alignItems="end">
                <GridItem display="flex" flexDirection="row" alignItems="center">
                    <Icon as={HiOutlineArrowNarrowUp} marginEnd={2} />
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
                    <Icon as={HiOutlineArrowNarrowDown} marginEnd={2} />
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
                        isActive={!!constrainProportions.y}
                        onClick={() => onConstrainProportions("y")}
                    />
                </GridItem>
                <GridItem display="flex" flexDirection="row" alignItems="center">
                    <Icon as={HiOutlineArrowNarrowLeft} marginEnd={2} />
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
                    <Icon as={HiOutlineArrowNarrowRight} marginEnd={2} />
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
                        isActive={!!constrainProportions.x}
                        onClick={() => onConstrainProportions("x")}
                    />
                </GridItem>
            </Grid>
        </>
    ) : (
        <></>
    );
};

export default EditorEditFlagPanel;
