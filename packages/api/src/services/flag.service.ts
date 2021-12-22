import { Flag, FlagPost } from "@flagstrips/common";
import { omit, isEmpty, sortBy } from "lodash";
import FlagEntity from "../entities/Flag";
import FlagBorderEntity from "../entities/Flag/FlagBorder";
import FlagPaddingEntity from "../entities/Flag/FlagPadding";
import { transformStripEntityToStrip } from "./strip.service";

const relations = ["border", "padding", "strips", "strips.text", "strips.image", "strips.image.imageOption"];

export const transformFlagEntityToFlag = (flagEntity: FlagEntity): Flag => {
    let strips = flagEntity.strips!.map(transformStripEntityToStrip);
    strips = sortBy(strips, "position");
    let flag = Flag.parse(flagEntity);
    flag = omit(flag, ["border.uid", "padding.uid"]) as Flag;
    return { ...(flag as Flag), strips };
};

export default class FlagService {
    static async getFlags(userUid: string | undefined = undefined): Promise<Flag[]> {
        const flagEntities = await FlagEntity.find({ relations, where: { ...(userUid && { userUid }) } });
        return flagEntities.map(transformFlagEntityToFlag);
    }

    static async getFlagByUid(uid: string, userUid: string | undefined = undefined): Promise<Flag | undefined> {
        const flagEntity = await FlagEntity.findOne({ where: { uid, ...(userUid && { userUid }) }, relations });
        return flagEntity ? transformFlagEntityToFlag(flagEntity) : undefined;
    }

    static async createFlag(flagPost: FlagPost, userUid: string): Promise<Flag> {
        const { padding, border, ...flag } = flagPost;

        const { uid } = await FlagEntity.create({ ...flag, userUid }).save();

        if (padding && !isEmpty(padding)) await FlagPaddingEntity.update({ flagUid: uid }, padding);
        if (border && !isEmpty(border)) await FlagBorderEntity.update({ flagUid: uid }, border);

        const flagEntity = await FlagEntity.findOneOrFail({ where: { uid }, relations });

        return transformFlagEntityToFlag(flagEntity);
    }

    static async updateFlag(flagPost: FlagPost, uid: string): Promise<Flag> {
        const { padding, border, ...flag } = flagPost;

        if (!isEmpty(flag)) await FlagEntity.update({ uid }, flag);
        if (padding && !isEmpty(padding)) await FlagPaddingEntity.update({ flagUid: uid }, padding);
        if (border && !isEmpty(border)) await FlagBorderEntity.update({ flagUid: uid }, border);

        const flagEntity = await FlagEntity.findOneOrFail({ where: { uid }, relations });

        return transformFlagEntityToFlag(flagEntity);
    }

    static async deleteFlag(uid: string): Promise<void> {
        await FlagEntity.delete({ uid });
    }
}
