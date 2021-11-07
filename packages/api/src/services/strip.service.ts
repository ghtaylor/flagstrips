import { getLeafPathsOfRecord, Strip, StripPost } from "@flagstrips/common";
import { isEmpty, omit, pick, sortBy } from "lodash";
import StripEntity from "../entities/Strip";
import StripImageEntity from "../entities/Strip/StripImage";
import StripTextEntity from "../entities/Strip/StripText";

const relations = ["flag", "text", "image", "image.imageOption"];

export const transformStripEntityToStrip = (stripEntity: StripEntity): Strip => {
    let strip = pick(stripEntity, getLeafPathsOfRecord(Strip));
    strip = omit(strip, ["text.id", "image.id"]);
    return strip as Strip;
};

export default class StripService {
    static async getStrips(
        userId: string | undefined = undefined,
        flagId: string | undefined = undefined,
    ): Promise<Strip[]> {
        const stripEntities = await StripEntity.find({
            relations,
            where: { ...(userId && { userId }), ...(flagId && { flagId }) },
        });
        const strips = stripEntities.map(transformStripEntityToStrip);
        return sortBy(strips, "position");
    }

    static async getStripById(
        id: string,
        userId: string | undefined = undefined,
        flagId: string | undefined = undefined,
    ): Promise<Strip | undefined> {
        const stripEntity = await StripEntity.findOne(id, {
            relations,
            where: { ...(userId && { userId }), ...(flagId && { flagId }) },
        });

        return stripEntity ? transformStripEntityToStrip(stripEntity) : undefined;
    }

    static async createStrip(stripPost: StripPost, userId: string, flagId: string): Promise<Strip> {
        const { text, image, ...strip } = stripPost;

        const { id } = await StripEntity.create({ ...strip, userId, flagId }).save();

        if (text && !isEmpty(text)) await StripTextEntity.update({ stripId: id }, text);
        if (image && !isEmpty(image)) await StripImageEntity.update({ stripId: id }, image);

        const stripEntity = await StripEntity.findOneOrFail(id, { relations });

        return transformStripEntityToStrip(stripEntity);
    }

    static async updateStrip(stripPost: StripPost, id: string): Promise<Strip> {
        const { text, image, ...strip } = stripPost;

        if (!isEmpty(strip)) await StripEntity.update({ id }, strip);
        if (text && !isEmpty(text)) await StripTextEntity.update({ stripId: id }, text);
        if (image && !isEmpty(image)) await StripImageEntity.update({ stripId: id }, image);

        const stripEntity = await StripEntity.findOneOrFail(id, { relations });

        return transformStripEntityToStrip(stripEntity);
    }

    static async deleteStrip(id: string): Promise<void> {
        await StripEntity.delete({ id });
    }
}
