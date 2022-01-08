import { Strip, StripImage, StripImageOption, StripPost, StripText } from "@flagstrips/common";
import { z, ZodLiteral } from "zod";

export const ApplyTextStylesChoice = z.union<
    [ZodLiteral<keyof StripText>, ZodLiteral<keyof StripText>, ZodLiteral<keyof StripText>, ZodLiteral<keyof StripText>]
>([z.literal("color"), z.literal("fontSize"), z.literal("fontFamily"), z.literal("fontWeight")]);

export type ApplyTextStylesChoice = z.infer<typeof ApplyTextStylesChoice>;

export const ApplyImageStylesChoice = z.union<
    [
        ZodLiteral<keyof StripImage>,
        ZodLiteral<keyof StripImage>,
        ZodLiteral<keyof StripImage>,
        ZodLiteral<keyof StripImage>,
    ]
>([z.literal("color"), z.literal("size"), z.literal("position"), z.literal("gapToText")]);

export type ApplyImageStylesChoice = z.infer<typeof ApplyImageStylesChoice>;

export const ApplyAllStyles = z.union([
    z.object({
        applyTo: z.literal("text"),
        choices: z.array(ApplyTextStylesChoice),
    }),
    z.object({
        applyTo: z.literal("image"),
        choices: z.array(ApplyImageStylesChoice),
    }),
]);

export type ApplyAllStyles = z.infer<typeof ApplyAllStyles>;

const EditStripFormText = z.object({
    text: StripText.shape.value,
    textColor: StripText.shape.color,
    textFontSize: StripText.shape.fontSize,
    textFontWeight: StripText.shape.fontWeight,
});

type EditStripFormText = z.infer<typeof EditStripFormText>;

const EditStripFormImage = z.object({
    imageOptionUid: StripImageOption.shape.uid,
    imageSize: StripImage.shape.size,
    imageColor: StripImage.shape.color,
    imageGapToText: StripImage.shape.gapToText,
    imagePosition: StripImage.shape.position,
});

type EditStripFormImage = z.infer<typeof EditStripFormImage>;

export const EditStripForm = z.intersection(EditStripFormText, EditStripFormImage);

export type EditStripForm = z.infer<typeof EditStripForm>;

export const getFormValuesByStrip = (strip: Strip): EditStripForm => ({
    text: strip.text.value,
    textColor: strip.text.color,
    textFontSize: strip.text.fontSize,
    textFontWeight: strip.text.fontWeight,
    imageOptionUid: strip.image.optionUid,
    imageSize: strip.image.size,
    imageColor: strip.image.color,
    imageGapToText: strip.image.gapToText,
    imagePosition: strip.image.position,
});

export const getStripPostByFormValues = (formValues: EditStripForm): StripPost => ({
    text: {
        value: formValues.text,
        fontSize: formValues.textFontSize,
        fontWeight: formValues.textFontWeight,
        color: formValues.textColor,
    },
    image: {
        size: formValues.imageSize,
        color: formValues.imageColor,
        gapToText: formValues.imageGapToText,
        position: formValues.imagePosition,
        optionUid: formValues.imageOptionUid,
    },
});
