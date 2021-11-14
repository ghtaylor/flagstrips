import { NextFunction, Request, Response } from "express";
import { unauthorizedError } from "../errors";
import UserService from "../services/user.service";
import { verifyAccessToken } from "../util/auth";

export default async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const { authorization } = req.headers;
    const accessToken = authorization && authorization.split(" ")[1];

    if (!accessToken) {
        return next(unauthorizedError());
    }

    try {
        const payload = verifyAccessToken(accessToken);
        const user = await UserService.getUserByUid(payload.userUid);

        if (!user) {
            return next(unauthorizedError());
        }

        req.authenticatedUser = user;
    } catch (error) {
        return next(unauthorizedError());
    }

    return next();
};
