import { Strip, StripImage, StripPost, StripText } from "@flagstrips/common";
import { z, ZodLiteral } from "zod";

export const ApplyTextStylesChoice = z.union<
    [ZodLiteral<keyof StripText>, ZodLiteral<keyof StripText>, ZodLiteral<keyof StripText>, ZodLiteral<keyof StripText>]
>([z.literal("color"), z.literal("fontSize"), z.literal("fontFamily"), z.literal("fontWeight")]);

export type ApplyTextStylesChoice = z.infer<typeof ApplyTextStylesChoice>;

export const ApplyImageStylesChoice = z.union<
    [ZodLiteral<keyof StripImage>, ZodLiteral<keyof StripImage>, ZodLiteral<keyof StripImage>]
>([z.literal("color"), z.literal("size"), z.literal("position")]);

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

export const EditStripForm = z.object({
    text: StripText.shape.value,
    textColor: StripText.shape.color,
    textFontSize: StripText.shape.fontSize,
    textFontWeight: StripText.shape.fontWeight,
    imageSize: StripImage.shape.size,
    imageColor: StripImage.shape.color,
    imagePosition: StripImage.shape.position,
});

export type EditStripForm = z.infer<typeof EditStripForm>;

export const getFormValuesByStrip = (strip: Strip): EditStripForm => ({
    text: strip.text.value,
    textColor: strip.text.color,
    textFontSize: strip.text.fontSize,
    textFontWeight: strip.text.fontWeight,
    imageSize: strip.image.size,
    imageColor: strip.image.color,
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
        position: formValues.imagePosition,
    },
});
