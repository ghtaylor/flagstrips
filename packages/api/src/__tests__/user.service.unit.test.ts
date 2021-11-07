import { UserWithPassword } from "@flagstrips/common";
import { applyPasswordHashToUser, transformUserEntityToUser } from "../services/user.service";

let userWithPassword: Partial<UserWithPassword> = {
    password: "b3st_pa55W0rd",
};

describe("Transforming User prior to creating in database", () => {
    describe("applyPasswordHashToUser", () => {
        it("should have a new password value before going into database", async () => {
            const userWithHashedPassword = await applyPasswordHashToUser(userWithPassword as UserWithPassword);
            expect(userWithHashedPassword.password).not.toBe(userWithPassword.password);
        });
    });
});

describe("Transforming User database entity to a type for API", () => {
    describe("transformUserEntityToUser", () => {
        it("should remove 'password' property from object", () => {
            expect(transformUserEntityToUser(userWithPassword as UserWithPassword)).not.toHaveProperty("password");
        });
    });
});
