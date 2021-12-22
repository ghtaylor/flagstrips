import { z } from "zod";

export const UpperLower = z.object({
    upper: z.number(),
    lower: z.number(),
});

export type UpperLower = z.infer<typeof UpperLower>;

export const TimeStamped = z.object({
    created: z.date(),
    modified: z.date(),
});

export type TimeStamped = z.infer<typeof TimeStamped>;
