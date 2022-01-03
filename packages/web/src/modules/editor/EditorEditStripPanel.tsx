import {
    Grid,
    GridItem,
    HStack,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Text,
} from "@chakra-ui/react";
import {
    StripImage,
    StripText,
    STRIP_IMAGE_SIZE_UPPER_LOWER,
    STRIP_TEXT_FONT_SIZE_UPPER_LOWER,
} from "@flagstrips/common";
import produce from "immer";
import { clamp, mapValues, ObjectIterator } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { ValueOf } from "type-fest";
import { useStripImageOptions } from "../providers/useQueryData";
import ApplyStylesToAllButton, { ApplyStylesToAllCheckbox } from "../ui/ApplyStylesToAllButton";
import ColorInput from "../ui/ColorInput";
import {
    ApplyImageStylesChoice,
    ApplyTextStylesChoice,
    EditStripForm,
    getFormValuesByStrip,
    getStripPostByFormValues,
} from "./edit-strip";
import { selectedStripSelector, useEditorStore } from "./useEditor";

export const fontWeights = StripText.shape.fontWeight.options.map(({ value }) => value);
export const imagePositions = StripImage.shape.position.options.map(({ value }) => value);
export const applyTextStylesCheckboxes: ApplyStylesToAllCheckbox<ApplyTextStylesChoice>[] = [
    { text: "color", value: "color" },
    { text: "font size", value: "fontSize" },
    { text: "font family", value: "fontFamily" },
    { text: "font weight", value: "fontWeight" },
];
export const applyImageStylesCheckboxes: ApplyStylesToAllCheckbox<ApplyImageStylesChoice>[] = [
    { text: "color", value: "color" },
    { text: "size", value: "size" },
    { text: "position", value: "position" },
];

const EditorEditStripPanel: React.FC = () => {
    const { updateStrip, selectedStripUid, applyStylesToAllStrips } = useEditorStore();
    const selectedStrip = useEditorStore(selectedStripSelector);
    const { data: stripImageOptions } = useStripImageOptions();

    const [formValues, setFormValues] = useState<EditStripForm>();
    //Used so that an update is not unnecessarily sent when the form values are first set.
    const [shouldUpdateStrip, setShouldUpdateStrip] = useState(false);

    const clampFormValue = useCallback(
        (key: keyof EditStripForm, value: ValueOf<EditStripForm>): ValueOf<EditStripForm> => {
            switch (key) {
                case "textFontSize":
                    return clamp(
                        value as number,
                        STRIP_TEXT_FONT_SIZE_UPPER_LOWER.lower,
                        STRIP_TEXT_FONT_SIZE_UPPER_LOWER.upper,
                    );
                case "imageSize":
                    return clamp(
                        value as number,
                        STRIP_IMAGE_SIZE_UPPER_LOWER.lower,
                        STRIP_IMAGE_SIZE_UPPER_LOWER.upper,
                    );
            }
            return value;
        },
        [],
    );

    const clampFormValues = useCallback(
        (formValues: EditStripForm): EditStripForm => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const iterate: ObjectIterator<EditStripForm, any> = (value, key) => {
                if (typeof value === "object") return mapValues(value, iterate);
                return clampFormValue(key as keyof EditStripForm, value);
            };
            return mapValues(formValues, iterate);
        },
        [formValues],
    );

    const handleBlur = useCallback(
        (key: keyof EditStripForm) => {
            if (formValues) {
                const value = formValues[key];
                if (typeof value === "number" && isNaN(value))
                    setFormValues(
                        produce((draftState) => {
                            //This never cast is hacky but works. There is an issue with the compiler and handling key/value pairs.
                            if (draftState) draftState[key] = clampFormValue(key, 0) as never;
                        }),
                    );
            }
        },
        [formValues],
    );

    const handleChangeValue = useCallback(<Key extends keyof EditStripForm>(key: Key, value: EditStripForm[Key]) => {
        setFormValues(
            produce((draftState) => {
                if (draftState) draftState[key] = value;
            }),
        );
    }, []);

    const handleChangeEvent = useCallback(
        (key: keyof EditStripForm, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { value } = e.target;

            if (!isNaN(+value)) handleChangeValue(key, Number(value));
            else handleChangeValue(key, value);
        },
        [],
    );

    useEffect(() => {
        if (formValues && shouldUpdateStrip && selectedStrip) {
            const clampedFormValues = clampFormValues(formValues);
            if (EditStripForm.safeParse(clampedFormValues).success)
                updateStrip(selectedStrip.uid, getStripPostByFormValues(clampedFormValues));
        }
        setShouldUpdateStrip(true);
    }, [formValues]);

    useEffect(() => {
        if (selectedStripUid && selectedStrip) {
            setShouldUpdateStrip(false);
            setFormValues(getFormValuesByStrip(selectedStrip));
        }
    }, [selectedStripUid]);

    useEffect(() => {
        if (selectedStrip && !formValues) {
            setShouldUpdateStrip(false);
            setFormValues(getFormValuesByStrip(selectedStrip));
        } else if (!selectedStrip && formValues) {
            setShouldUpdateStrip(true);
            setFormValues(undefined);
        }
    }, [selectedStrip, formValues]);

    return formValues ? (
        <>
            <Text textStyle="editorHeader" marginBottom={1}>
                text
            </Text>
            <Grid templateColumns="64px auto 80px" gridGap={1} alignItems="end">
                <GridItem colSpan={2}>
                    <Input size="xs" value={formValues.text} onChange={(e) => handleChangeEvent("text", e)} />
                </GridItem>
                <GridItem colSpan={1}>
                    <ColorInput
                        size="xs"
                        value={formValues.textColor}
                        onHexChange={(hex) => handleChangeValue("textColor", hex)}
                    />
                </GridItem>
                <GridItem>
                    <NumberInput
                        size="xs"
                        min={STRIP_TEXT_FONT_SIZE_UPPER_LOWER.lower}
                        max={STRIP_TEXT_FONT_SIZE_UPPER_LOWER.upper}
                        value={!isNaN(formValues.textFontSize) ? formValues.textFontSize : ""}
                        onChange={(_, value) => handleChangeValue("textFontSize", value)}
                        onBlur={() => handleBlur("textFontSize")}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </GridItem>
                <GridItem>
                    <Select size="xs" />
                </GridItem>
                <GridItem>
                    <Select
                        size="xs"
                        value={formValues.textFontWeight}
                        onChange={(e) => handleChangeEvent("textFontWeight", e)}
                    >
                        {fontWeights.map((fontWeight) => (
                            <option key={fontWeight} value={fontWeight}>
                                {fontWeight}
                            </option>
                        ))}
                    </Select>
                </GridItem>
            </Grid>

            <ApplyStylesToAllButton
                checkboxes={applyTextStylesCheckboxes}
                onApply={(values) => {
                    const choices = values as ApplyTextStylesChoice[];
                    applyStylesToAllStrips({ applyTo: "text", choices });
                }}
                marginBottom={3}
            />

            {stripImageOptions && (
                <>
                    <Text textStyle="editorHeader" marginBottom={1}>
                        image
                    </Text>
                    <Grid templateColumns="64px auto 80px" gridGap={1} alignItems="end">
                        <GridItem colSpan={2}>
                            <Select
                                size="xs"
                                value={formValues.imageOptionUid}
                                onChange={(e) => handleChangeEvent("imageOptionUid", e)}
                            >
                                {stripImageOptions.map(({ uid, name }) => (
                                    <option key={uid} value={uid}>
                                        {name}
                                    </option>
                                ))}
                            </Select>
                        </GridItem>
                        <GridItem colSpan={1}>
                            <ColorInput
                                size="xs"
                                value={formValues.imageColor}
                                onHexChange={(hex) => handleChangeValue("imageColor", hex)}
                            />
                        </GridItem>
                        <GridItem>
                            <NumberInput
                                size="xs"
                                min={STRIP_IMAGE_SIZE_UPPER_LOWER.lower}
                                max={STRIP_IMAGE_SIZE_UPPER_LOWER.upper}
                                value={!isNaN(formValues.imageSize) ? formValues.imageSize : ""}
                                onChange={(_, value) => handleChangeValue("imageSize", value)}
                                onBlur={() => handleBlur("imageSize")}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Select
                                size="xs"
                                value={formValues.imagePosition}
                                onChange={(e) => handleChangeEvent("imagePosition", e)}
                            >
                                {imagePositions.map((imagePosition) => (
                                    <option key={imagePosition} value={imagePosition}>
                                        {imagePosition}
                                    </option>
                                ))}
                            </Select>
                        </GridItem>
                    </Grid>
                    <ApplyStylesToAllButton
                        checkboxes={applyImageStylesCheckboxes}
                        onApply={(values) => {
                            const choices = values as ApplyImageStylesChoice[];
                            applyStylesToAllStrips({ applyTo: "image", choices });
                        }}
                        marginBottom={3}
                    />
                </>
            )}

            <HStack marginBottom={3}></HStack>

            <Text textStyle="editorCaption" marginBottom={1}>
                animation in
            </Text>
        </>
    ) : (
        <></>
    );
};

export default EditorEditStripPanel;
