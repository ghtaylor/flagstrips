import { Flag, FlagStrip, Strip } from "@flagstrips/common";
import { v4 as uuidv4 } from "uuid";
import FlagEntity from "../entities/Flag";

import { applyStripIndexToStrip, transformFlagEntityToFlag } from "../services/flag.service";

describe("Transforming Flag database entity to a type for API", () => {
    const flagId = uuidv4();
    const stripIds = [uuidv4(), uuidv4()];

    const flagStrips: FlagStrip[] = stripIds.map((stripId, stripIndex) => ({
        flagId,
        stripId,
        stripIndex,
    }));

    const strips: Partial<Strip>[] = stripIds.map((id) => ({ id }));

    const strip = strips[0];

    const flagEntity: Partial<FlagEntity> = {
        id: flagId,
        flagStrips,
        strips: strips as Strip[],
        user: undefined,
    };

    describe("applyStripIndexToStrip", () => {
        const stripIndexed: Strip = applyStripIndexToStrip(strip as Strip, flagStrips);

        it("should add index field", () => {
            expect(stripIndexed).toHaveProperty("index");
        });

        it("should have index from matching FlagStrip", () => {
            expect(stripIndexed.index).toBe(flagStrips.find((flagStrip) => flagStrip.stripId === strip.id)?.stripIndex);
        });
    });

    describe("transformFlagEntityToFlag", () => {
        const flag: Flag = transformFlagEntityToFlag(flagEntity as FlagEntity);

        it("should remove 'flagStrips' property from object", () => {
            expect(flag).not.toHaveProperty("flagStrips");
        });

        it("should remove 'user' property from object", () => {
            expect(flag).not.toHaveProperty("user");
        });

        it("should have the same number of strips it started with", () => {
            expect(flag.strips.length).toBe(flagEntity.strips!.length);
        });

        it("should have Strips that have index from matching FlagStrip", () => {
            flag.strips.forEach((strip) => {
                expect(strip.index).toBe(flagStrips.find((flagStrip) => flagStrip.stripId === strip.id)?.stripIndex);
            });
        });
    });
});
