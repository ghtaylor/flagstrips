import { StripAnimation } from "@flagstrips/common";
import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import StripEntity from "../entities/Strip";
import connection from "../providers/database";
import StripService from "../services/strip.service";
import insertDbTestData, { DBTestDataResult } from "./helpers/insert-db-test-data";

let dbTestDataResult: DBTestDataResult;

beforeAll(async () => {
    await connection.create();
});

afterAll(async () => {
    await connection.close();
});

beforeEach(async () => {
    await connection.clear();
    dbTestDataResult = await insertDbTestData();
});

describe("createStrip", () => {
    test("adds a new strip to the appropriate flag", async () => {
        const { userUid, flagUid } = dbTestDataResult;
        const strip = await StripService.createStrip({}, userUid, flagUid);
        const stripEntitiesInFlag = await StripEntity.find({ where: { flagUid } });
        expect(stripEntitiesInFlag.find((stripEntity) => stripEntity.uid === strip.uid)).toBeDefined();
    });
});

describe("getStrips", () => {
    test("all strips returned have the expected animation properties defined", async () => {
        const strips = await StripService.getStrips();
        strips.forEach((strip) => {
            expect(strip.inAnimation).toBeDefined();
            expect(strip.staticAnimation).toBeDefined();
            expect(strip.outAnimation).toBeDefined();
        });
    });
    test("all animation related properties match StripAnimation type", async () => {
        const strips = await StripService.getStrips();
        strips.forEach((strip) => {
            expect(() => StripAnimation.parse(strip.inAnimation)).not.toThrow();
            expect(() => StripAnimation.parse(strip.staticAnimation)).not.toThrow();
            expect(() => StripAnimation.parse(strip.outAnimation)).not.toThrow();
        });
    });
});

describe("updateStrip", () => {
    test("
    ");
});
