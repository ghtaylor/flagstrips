import { z } from "zod";

export const AnimationEasingOption = z.union([
    z.literal("linear"),
    z.literal("easeInQuad"),
    z.literal("easeInCubic"),
    z.literal("easeInQuart"),
    z.literal("easeInQuint"),
    z.literal("easeInSine"),
    z.literal("easeInExpo"),
    z.literal("easeInCirc"),
    z.literal("easeInBack"),
    z.literal("easeInElastic"),
    z.literal("easeInBounce"),
    z.literal("easeOutQuad"),
    z.literal("easeOutCubic"),
    z.literal("easeOutQuart"),
    z.literal("easeOutQuint"),
    z.literal("easeOutSine"),
    z.literal("easeOutExpo"),
    z.literal("easeOutCirc"),
    z.literal("easeOutBack"),
    z.literal("easeOutElastic"),
    z.literal("easeOutBounce"),
    z.literal("easeInOutQuad"),
    z.literal("easeInOutCubic"),
    z.literal("easeInOutQuart"),
    z.literal("easeInOutQuint"),
    z.literal("easeInOutSine"),
    z.literal("easeInOutExpo"),
    z.literal("easeInOutCirc"),
    z.literal("easeInOutBack"),
    z.literal("easeInOutElastic"),
    z.literal("easeInOutBounce"),
]);

export const AnimationPresetOption = z.object({
    uid: z.string(),
    name: z.string(),
    animeJson: z.record(z.any()),
    direction: z.union([z.literal("in"), z.literal("static"), z.literal("out")]),
});

export type AnimationEasingOption = z.infer<typeof AnimationEasingOption>;
export type AnimationPresetOption = z.infer<typeof AnimationPresetOption>;
