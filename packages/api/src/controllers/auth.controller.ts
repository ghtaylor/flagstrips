import { AuthAccessTokenResponse, COOKIE_KEY_REFRESH_TOKEN, UserLogin } from "@flagstrips/common";
import { NextFunction, Request, Response } from "express";
import { invalidPostBodyError, unauthorizedError } from "../errors";
import AuthService from "../services/auth.service";

export default class AuthController {
    private static applyRefreshTokenCookie(res: Response, refreshToken: string) {
        res.cookie(COOKIE_KEY_REFRESH_TOKEN, refreshToken, { httpOnly: true, maxAge: 604800000 });
    }

    static async login(
        req: Request,
        res: Response<AuthAccessTokenResponse>,
        next: NextFunction,
    ): Promise<Response | void> {
        if (UserLogin.guard(req.body)) {
            const userLogin = req.body;
            try {
                const { accessToken, refreshToken } = await AuthService.login(userLogin);
                const accessTokenResponse: AuthAccessTokenResponse = { accessToken };
                AuthController.applyRefreshTokenCookie(res, refreshToken);
                return res.status(200).send(accessTokenResponse);
            } catch (error) {
                next(error);
            }
        } else {
            return next(invalidPostBodyError());
        }
    }

    static logout(_req: Request, res: Response): Response {
        AuthController.applyRefreshTokenCookie(res, "");
        return res.status(204).send();
    }

    static async refreshToken(
        req: Request,
        res: Response<AuthAccessTokenResponse>,
        next: NextFunction,
    ): Promise<Response | void> {
        const { [COOKIE_KEY_REFRESH_TOKEN]: refreshToken } = req.cookies;

        if (typeof refreshToken !== "string" || (typeof refreshToken === "string" && refreshToken.length === 0)) {
            return next(unauthorizedError());
        }

        try {
            const { accessToken, newRefreshToken } = AuthService.refreshToken(refreshToken);
            const accessTokenResponse: AuthAccessTokenResponse = { accessToken };
            AuthController.applyRefreshTokenCookie(res, newRefreshToken);
            return res.status(202).send(accessTokenResponse);
        } catch (error) {
            return next(error);
        }
    }
}
