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
import { Strip, StripPost, StripText, STRIP_TEXT_FONT_SIZE_UPPER_LOWER } from "@flagstrips/common";
import produce from "immer";
import { clamp, isFinite } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useEditorStore } from "../hooks/useEditor";
import { useStripImageOptions } from "../hooks/useQueryData";
import ColorInput from "../ui/ColorInput";

const EditStripForm = z.object({
    text: StripText.shape.value,
    textColor: StripText.shape.color,
    textFontSize: StripText.shape.fontSize,
    textFontWeight: StripText.shape.fontWeight,
});

type EditStripForm = z.infer<typeof EditStripForm>;

const getInitialFormValues = (strip: Strip): EditStripForm => ({
    text: strip.text.value,
    textColor: strip.text.color,
    textFontSize: strip.text.fontSize,
    textFontWeight: strip.text.fontWeight,
});

const getStripPostFromFormValues = (formValues: EditStripForm): StripPost => ({
    text: {
        value: formValues.text,
        fontSize: formValues.textFontSize,
        fontWeight: formValues.textFontWeight,
        color: formValues.textColor,
    },
});

const fontWeights = StripText.shape.fontWeight.options.map(({ value }) => value);

const EditorEditStripPanel: React.FC = () => {
    const { selectedFlag, selectedStripPosition, updateSelectedStrip } = useEditorStore();
    const { data: stripImageOptions } = useStripImageOptions();

    const [formValues, setFormValues] = useState<EditStripForm>();
    //Used so that an update is not unnecessarily sent when the form values are first set.
    const [shouldUpdateStrip, setShouldUpdateStrip] = useState(false);

    const handleChangeValue = useCallback(<Key extends keyof EditStripForm>(key: Key, value: EditStripForm[Key]) => {
        setFormValues(
            produce((draftState) => {
                if (draftState) {
                    draftState[key] = value;
                }
            }),
        );
    }, []);

    const handleChangeEvent = useCallback(
        (key: keyof EditStripForm, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { value } = e.target;

            if (isFinite(value)) {
                handleChangeValue(key, Number(value));
            } else {
                handleChangeValue(key, value);
            }
        },
        [],
    );

    const clampFormValues = useCallback(
        (formValues: EditStripForm): EditStripForm => ({
            ...formValues,
            textFontSize: clamp(
                formValues.textFontSize,
                STRIP_TEXT_FONT_SIZE_UPPER_LOWER.lower,
                STRIP_TEXT_FONT_SIZE_UPPER_LOWER.upper,
            ),
        }),
        [formValues],
    );

    useEffect(() => {
        if (formValues && shouldUpdateStrip) {
            const clampedFormValues = clampFormValues(formValues);
            if (EditStripForm.safeParse(clampedFormValues).success)
                updateSelectedStrip(getStripPostFromFormValues(clampedFormValues));
        }
        setShouldUpdateStrip(true);
    }, [formValues]);

    useEffect(() => {
        if (selectedFlag) {
            setShouldUpdateStrip(false);
            setFormValues(getInitialFormValues(selectedFlag.strips[selectedStripPosition]));
        }
    }, [selectedStripPosition]);

    useEffect(() => {
        if (selectedFlag && selectedFlag.strips[selectedStripPosition] !== undefined && !formValues) {
            setShouldUpdateStrip(false);
            setFormValues(getInitialFormValues(selectedFlag.strips[selectedStripPosition]));
        }
    }, [selectedStripPosition, selectedFlag, formValues]);

    return formValues ? (
        <>
            <Text textStyle="editorHeader" marginBottom={1}>
                text
            </Text>
            <Grid templateColumns="64px auto 80px" gridGap={1} alignItems="end" marginBottom={3}>
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
                        value={formValues.textFontSize ? formValues.textFontSize : ""}
                        onChange={(_, value) => handleChangeValue("textFontSize", value)}
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
                    <Select size="xs" onChange={(e) => handleChangeEvent("textFontWeight", e)}>
                        {fontWeights.map((fontWeight) => (
                            <option key={fontWeight} value={fontWeight}>
                                {fontWeight}
                            </option>
                        ))}
                    </Select>
                </GridItem>
            </Grid>

            {stripImageOptions && (
                <>
                    <Text textStyle="editorHeader" marginBottom={1}>
                        icon
                    </Text>
                    <Select size="xs">
                        {stripImageOptions.map(({ uid, name, uri }) => (
                            <option key={uid} value={uid}>
                                {name}
                            </option>
                        ))}
                    </Select>
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
