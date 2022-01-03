import { Flag, FlagPadding, FlagPost } from "@flagstrips/common";
import { z } from "zod";

//If value in object is set, then value proportions are being constrained. Value is ratio.
export const ConstrainProportionsFlagPadding = z.object({
    x: z.optional(z.number()),
    y: z.optional(z.number()),
});

export type ConstrainProportionsFlagPadding = z.infer<typeof ConstrainProportionsFlagPadding>;

export const EditFlagFormPadding = z.object({
    paddingTop: FlagPadding.shape.top,
    paddingBottom: FlagPadding.shape.bottom,
    paddingLeft: FlagPadding.shape.left,
    paddingRight: FlagPadding.shape.right,
});

export type EditFlagFormPadding = z.infer<typeof EditFlagFormPadding>;

export const EditFlagForm = EditFlagFormPadding;

export type EditFlagForm = z.infer<typeof EditFlagForm>;

export const isEditFlagFormPaddingKey = (key: string): key is keyof EditFlagFormPadding =>
    Object.keys(EditFlagFormPadding.shape).some((paddingKey) => paddingKey === key);

export const getFormValuesByFlag = (flag: Flag): EditFlagForm => ({
    paddingTop: flag.padding.top,
    paddingBottom: flag.padding.bottom,
    paddingLeft: flag.padding.left,
    paddingRight: flag.padding.right,
});

export const getFlagPostByFormValues = (formValues: EditFlagForm): FlagPost => ({
    padding: {
        top: formValues.paddingTop,
        bottom: formValues.paddingBottom,
        left: formValues.paddingLeft,
        right: formValues.paddingRight,
    },
});
