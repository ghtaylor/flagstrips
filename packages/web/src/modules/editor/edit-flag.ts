import { Flag, FlagPadding, FlagBorder, FlagPost } from "@flagstrips/common";
import { z } from "zod";

// If constrain is enabled the value is the ratio by which to constrain,
// if constrain is disabled the value is undefined.
export const ConstrainProportionsFlag = z.object({
    paddingX: z.optional(z.number()),
    paddingY: z.optional(z.number()),
});

export type ConstrainProportionsFlag = z.infer<typeof ConstrainProportionsFlag>;

export const EditFlagFormPadding = z.object({
    paddingTop: FlagPadding.shape.top,
    paddingBottom: FlagPadding.shape.bottom,
    paddingLeft: FlagPadding.shape.left,
    paddingRight: FlagPadding.shape.right,
});

export type EditFlagFormPadding = z.infer<typeof EditFlagFormPadding>;

export const EditFlagFormBorder = z.object({
    borderRadius: FlagBorder.shape.radius,
    borderColor: FlagBorder.shape.color,
    borderWidth: FlagBorder.shape.width,
});

export type EditFlagFormBorder = z.infer<typeof EditFlagFormBorder>;

export const EditFlagForm = z.intersection(EditFlagFormPadding, EditFlagFormBorder);

export type EditFlagForm = z.infer<typeof EditFlagForm>;

export const isEditFlagFormPaddingKey = (key: string): key is keyof EditFlagFormPadding =>
    Object.keys(EditFlagFormPadding.shape).some((paddingKey) => paddingKey === key);

export const getFormValuesByFlag = (flag: Flag): EditFlagForm => {
    return {
        paddingTop: flag.padding.top,
        paddingBottom: flag.padding.bottom,
        paddingLeft: flag.padding.left,
        paddingRight: flag.padding.right,
        borderRadius: flag.border.radius,
        borderColor: flag.border.color,
        borderWidth: flag.border.width,
    };
};

export const getFlagPostByFormValues = (formValues: EditFlagForm): FlagPost => ({
    padding: {
        top: formValues.paddingTop,
        bottom: formValues.paddingBottom,
        left: formValues.paddingLeft,
        right: formValues.paddingRight,
    },
    border: {
        color: formValues.borderColor,
        radius: formValues.borderRadius,
        width: formValues.borderWidth,
    },
});
