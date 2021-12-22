import { z } from "zod";

export const COOKIE_KEY_REFRESH_TOKEN = "refresh_token";

export const AuthAccessTokenResponse = z.object({
    accessToken: z.string(),
});

export const AuthLoginJWTPayload = z.object({
    userUid: z.string(),
    role: z.string(),
});

export type AuthAccessTokenResponse = z.infer<typeof AuthAccessTokenResponse>;
export type AuthLoginJWTPayload = z.infer<typeof AuthLoginJWTPayload>;
