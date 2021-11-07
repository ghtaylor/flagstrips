import { Flag, FlagPost, getLeafPathsOfRecord } from "@flagstrips/common";
import { pick, omit, isEmpty, sortBy } from "lodash";
import FlagEntity from "../entities/Flag";
import FlagBorderEntity from "../entities/Flag/FlagBorder";
import FlagPaddingEntity from "../entities/Flag/FlagPadding";
import { transformStripEntityToStrip } from "./strip.service";

const relations = ["border", "padding", "strips", "strips.text", "strips.image", "strips.image.imageOption"];

export const transformFlagEntityToFlag = (flagEntity: FlagEntity): Flag => {
    let flag = pick(flagEntity, getLeafPathsOfRecord(Flag));
    flag = omit(flag, ["border.id", "padding.id"]);
    let strips = flag.strips!.map(transformStripEntityToStrip);
    strips = sortBy(strips, "position");
    return { ...(flag as Flag), strips };
};

export default class FlagService {
    static async getFlags(userId: string | undefined = undefined): Promise<Flag[]> {
        const flagEntities = await FlagEntity.find({ relations, where: { ...(userId && { userId }) } });
        return flagEntities.map(transformFlagEntityToFlag);
    }

    static async getFlagById(id: string, userId: string | undefined = undefined): Promise<Flag | undefined> {
        const flagEntity = await FlagEntity.findOne(id, { relations, where: { ...(userId && { userId }) } });
        return flagEntity ? transformFlagEntityToFlag(flagEntity) : undefined;
    }

    static async createFlag(flagPost: FlagPost, userId: string): Promise<Flag> {
        const { padding, border, ...flag } = flagPost;

        const { id } = await FlagEntity.create({ ...flag, userId }).save();

        if (padding && !isEmpty(padding)) await FlagPaddingEntity.update({ flagId: id }, padding);
        if (border && !isEmpty(border)) await FlagBorderEntity.update({ flagId: id }, border);

        const flagEntity = await FlagEntity.findOneOrFail(id, { relations });

        return transformFlagEntityToFlag(flagEntity);
    }

    static async updateFlag(flagPost: FlagPost, flagId: string): Promise<Flag> {
        const { padding, border, ...flag } = flagPost;

        if (!isEmpty(flag)) await FlagEntity.update({ id: flagId }, flag);
        if (padding && !isEmpty(padding)) await FlagPaddingEntity.update({ flagId }, padding);
        if (border && !isEmpty(border)) await FlagBorderEntity.update({ flagId }, border);

        const flagEntity = await FlagEntity.findOneOrFail(flagId, { relations });

        return transformFlagEntityToFlag(flagEntity);
    }

    static async deleteFlag(id: string): Promise<void> {
        await FlagEntity.delete({ id });
    }
}
