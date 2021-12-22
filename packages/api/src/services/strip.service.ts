import { Strip, StripImageOption, StripPost } from "@flagstrips/common";
import { isEmpty, omit, sortBy } from "lodash";
import StripEntity from "../entities/Strip";
import StripImageEntity from "../entities/Strip/StripImage";
import StripImageOptionEntity from "../entities/Strip/StripImageOption";
import StripTextEntity from "../entities/Strip/StripText";

const relations = ["flag", "text", "image", "image.imageOption"];

export const transformStripEntityToStrip = (stripEntity: StripEntity): Strip => {
    let strip = Strip.parse(stripEntity);
    strip = omit(strip, ["text.uid", "image.uid"]) as Strip;
    return strip as Strip;
};

export default class StripService {
    static async getStrips(
        userUid: string | undefined = undefined,
        flagUid: string | undefined = undefined,
    ): Promise<Strip[]> {
        const stripEntities = await StripEntity.find({
            relations,
            where: { ...(userUid && { userUid }), ...(flagUid && { flagUid }) },
        });
        const strips = stripEntities.map(transformStripEntityToStrip);
        return sortBy(strips, "position");
    }

    static async getStripByUid(
        uid: string,
        userUid: string | undefined = undefined,
        flagUid: string | undefined = undefined,
    ): Promise<Strip | undefined> {
        const stripEntity = await StripEntity.findOne({
            where: { uid, ...(userUid && { userUid }), ...(flagUid && { flagUid }) },
            relations,
        });

        return stripEntity ? transformStripEntityToStrip(stripEntity) : undefined;
    }

    static async createStrip(stripPost: StripPost, userUid: string, flagUid: string): Promise<Strip> {
        const { text, image, ...strip } = stripPost;

        const { uid } = await StripEntity.create({ ...strip, userUid, flagUid }).save();

        if (text && !isEmpty(text)) await StripTextEntity.update({ stripUid: uid }, text);
        if (image && !isEmpty(image)) await StripImageEntity.update({ stripUid: uid }, image);

        const stripEntity = await StripEntity.findOneOrFail({ where: { uid }, relations });

        return transformStripEntityToStrip(stripEntity);
    }

    static async updateStrip(stripPost: StripPost, uid: string): Promise<Strip> {
        const { text, image, ...strip } = stripPost;

        if (!isEmpty(strip)) await StripEntity.update({ uid }, strip);
        if (text && !isEmpty(text)) await StripTextEntity.update({ stripUid: uid }, text);
        if (image && !isEmpty(image)) await StripImageEntity.update({ stripUid: uid }, image);

        const stripEntity = await StripEntity.findOneOrFail({ where: { uid }, relations });

        return transformStripEntityToStrip(stripEntity);
    }

    static async deleteStrip(uid: string): Promise<void> {
        await StripEntity.delete({ uid });
    }

    static async getStripImageOptions(): Promise<StripImageOption[]> {
        const stripImageOptionEntities = await StripImageOptionEntity.find();

        return stripImageOptionEntities.map((stripImageOptionEntity) => omit(stripImageOptionEntity, "id"));
    }
}
