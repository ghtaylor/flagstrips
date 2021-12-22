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

        const parseUserLoginEmail = UserLoginEmail.safeParse(userLogin);
        const parseUserLoginUsername = UserLoginUsername.safeParse(userLogin);
        if (parseUserLoginEmail.success) {
            userWithPassword = await UserService.getUserWithPasswordByEmail(parseUserLoginEmail.data.email);
        } else if (parseUserLoginUsername.success) {
            userWithPassword = await UserService.getUserWithPasswordByUsername(parseUserLoginUsername.data.username);
        }

        // TODO: Refine this to be more accurate.
        if (!userWithPassword) throw unsuccessfulLoginError("username");

        if (await bcrypt.compare(userLogin.password, userWithPassword.password)) {
            //Authenticated.
            const payload: AuthLoginJWTPayload = { userUid: userWithPassword.uid, role: userWithPassword.roleName };
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
