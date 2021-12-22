import { z } from "zod";
import { TimeStamped } from "./generic";
import { Strip, StripPost } from "./strip";

export const FlagBorder = z.object({
    uid: z.string().optional(),
    width: z.number(),
    color: z.string(),
    topLeft: z.number(),
    topRight: z.number(),
    bottomLeft: z.number(),
    bottomRight: z.number(),
});

export const FlagBorderPost = FlagBorder.omit({ uid: true }).deepPartial();

export const FlagPadding = z.object({
    uid: z.string().optional(),
    top: z.number(),
    right: z.number(),
    bottom: z.number(),
    left: z.number(),
});

export const FlagPaddingPost = FlagPadding.omit({ uid: true }).deepPartial();

export const Flag = TimeStamped.extend({
    uid: z.string(),
    title: z.string(),
    border: FlagBorder,
    padding: FlagPadding,
    strips: z.array(Strip),
});

export const FlagPost = z.intersection(
    Flag.omit({ uid: true, border: true, padding: true, strips: true }).deepPartial(),
    z
        .object({
            border: FlagBorderPost,
            padding: FlagPaddingPost,
            strips: z.array(StripPost),
        })

        .deepPartial(),
);

export type FlagBorder = z.infer<typeof FlagBorder>;
export type FlagBorderPost = z.infer<typeof FlagBorderPost>;
export type FlagPadding = z.infer<typeof FlagPadding>;
export type FlagPaddingPost = z.infer<typeof FlagPaddingPost>;
export type Flag = z.infer<typeof Flag>;
export type FlagPost = z.infer<typeof FlagPost>;
