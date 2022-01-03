import { z } from "zod";
import { UpperLower, TimeStamped } from "./generic";

export const STRIP_TEXT_FONT_SIZE_UPPER_LOWER: UpperLower = {
    upper: 64,
    lower: 4,
};

export const STRIP_IMAGE_SIZE_UPPER_LOWER: UpperLower = {
    upper: 64,
    lower: 12,
};

export const StripText = z.object({
    uid: z.string().optional(),
    value: z.string(),
    color: z.string(),
    fontFamily: z.string(),
    fontWeight: z.union([z.literal("normal"), z.literal("bold"), z.literal("bolder"), z.literal("lighter")]),
    fontSize: z.number().min(STRIP_TEXT_FONT_SIZE_UPPER_LOWER.lower).max(STRIP_TEXT_FONT_SIZE_UPPER_LOWER.upper),
});

export const StripTextPost = StripText.omit({ uid: true }).deepPartial();

export const StripImageOption = z.object({
    uid: z.string(),
    uri: z.string(),
    name: z.string(),
});

export const StripImage = z.object({
    uid: z.string().optional(),
    size: z.number(),
    color: z.string(),
    position: z.union([z.literal("left"), z.literal("right")]),
    optionUid: z.string(),
});

export const StripImagePost = StripImage.omit({ uid: true }).deepPartial();

export const Strip = TimeStamped.extend({
    uid: z.string(),
    position: z.number(),
    backgroundColor: z.string(),
    text: StripText,
    image: StripImage,
});

export const StripPost = z.intersection(
    Strip.omit({ uid: true, text: true, image: true }).deepPartial(),
    z.object({ text: StripTextPost, image: StripImagePost }).deepPartial(),
);

export type StripText = z.infer<typeof StripText>;
export type StripTextPost = z.infer<typeof StripTextPost>;
export type StripImageOption = z.infer<typeof StripImageOption>;
export type StripImage = z.infer<typeof StripImage>;
export type StripImagePost = z.infer<typeof StripImagePost>;
export type Strip = z.infer<typeof Strip>;
export type StripPost = z.infer<typeof StripPost>;
