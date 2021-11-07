import { getDuplicatedFieldByDetailMessage } from "../util";
import { hashPassword } from "../util/auth";

describe("Utility functions", () => {
    describe("Postgres getAlreadyExistsFieldByDetailMessages", () => {
        it.each([
            ["Key (username)=(test) already exists.", "username"],
            ["Key (email)=(test@test.com) already exists.", "email"],
        ])("should get correct field from detail message", (detailMessage, expected) => {
            expect(getDuplicatedFieldByDetailMessage(detailMessage)).toBe(expected);
        });

        it.each([["skfjfjdfjksd"], ["492813428"], ["(hh) khj"], ["ffs8sf8 (acxz)"]])(
            "should throw an Error if an unusable 'detailMessage' is provided",
            (detailMessage) => {
                expect(() => getDuplicatedFieldByDetailMessage(detailMessage)).toThrow();
            },
        );
    });

    describe("hashPassword", () => {
        it.each(["best_password_EVER", "anoTH3R_g00d_pa55W0rd"])(
            "should not match provided password",
            async (password) => {
                expect(await hashPassword(password)).not.toBe(password);
            },
        );
    });
});
