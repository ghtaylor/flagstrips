import { AuthLoginJWTPayload } from "@flagstrips/common";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

if (!(ACCESS_TOKEN_SECRET && REFRESH_TOKEN_SECRET)) {
    console.error("Exiting app due to missing ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET environment variables.");
    process.exit(1);
}

export const hashPassword = async (password: string): Promise<string> => bcrypt.hash(password, await bcrypt.genSalt());

export const getAccessToken = (payload: AuthLoginJWTPayload): string =>
    sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1m" });

export const getRefreshToken = (payload: AuthLoginJWTPayload): string =>
    sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

export const verifyAccessToken = (accessToken: string): AuthLoginJWTPayload => {
    const payload = verify(accessToken, ACCESS_TOKEN_SECRET);

    if (typeof payload === "object" && "userUid" in payload && "role" in payload) {
        return { userUid: payload.userUid, role: payload.role };
    } else {
        throw new Error("Access token does not have a valid JWT payload.");
    }
};

export const verifyRefreshToken = (refreshToken: string): AuthLoginJWTPayload => {
    const payload = verify(refreshToken, REFRESH_TOKEN_SECRET);

    if (typeof payload === "object" && "userUid" in payload && "role" in payload) {
        return { userUid: payload.userUid, role: payload.role };
    } else {
        throw new Error("Access token does not have a valid JWT payload.");
    }
};
