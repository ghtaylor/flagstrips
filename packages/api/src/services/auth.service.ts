import {
    AuthLoginJWTPayload,
    UserWithPassword,
    UserLogin,
    UserLoginEmail,
    UserLoginUsername,
} from "@flagstrips/common";
import bcrypt from "bcrypt";
import { unauthorizedError, unsuccessfulLoginError } from "../errors";
import { getAccessToken, getRefreshToken, verifyRefreshToken } from "../util/auth";
import UserService from "./user.service";

export default class AuthService {
    static async login(userLogin: UserLogin): Promise<{ accessToken: string; refreshToken: string }> {
        let userWithPassword: UserWithPassword | undefined;

        if (UserLoginEmail.guard(userLogin)) {
            userWithPassword = await UserService.getUserWithPasswordByEmail(userLogin.email);
        } else if (UserLoginUsername.guard(userLogin)) {
            userWithPassword = await UserService.getUserWithPasswordByUsername(userLogin.username);
        }

        if (!userWithPassword) {
            throw unsuccessfulLoginError("username");
        }

        if (await bcrypt.compare(userLogin.password, userWithPassword.password)) {
            //Authenticated.
            const payload: AuthLoginJWTPayload = { userId: userWithPassword.id, role: userWithPassword.roleName };
            return { accessToken: getAccessToken(payload), refreshToken: getRefreshToken(payload) };
        } else {
            throw unsuccessfulLoginError("password");
        }
    }

    static refreshToken(refreshToken: string): { accessToken: string; newRefreshToken: string } {
        try {
            const payload = verifyRefreshToken(refreshToken);
            return { accessToken: getAccessToken(payload), newRefreshToken: getRefreshToken(payload) };
        } catch (error) {
            throw unauthorizedError();
        }
    }
}
