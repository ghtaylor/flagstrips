import * as t from "runtypes";

export const COOKIE_KEY_REFRESH_TOKEN = "refresh_token";

export const AuthAccessTokenResponse = t.Record({
    accessToken: t.String,
});

export const AuthLoginJWTPayload = t.Record({
    userUid: t.String,
    role: t.String,
});

export type AuthAccessTokenResponse = t.Static<typeof AuthAccessTokenResponse>;
export type AuthLoginJWTPayload = t.Static<typeof AuthLoginJWTPayload>;
