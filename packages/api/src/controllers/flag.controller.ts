import { ApiResponseCollection, Flag, FlagPost } from "@flagstrips/common";
import { NextFunction, Request, Response } from "express";
import { forbiddenResourceAccessError, unauthorizedError } from "../errors";
import FlagService from "../services/flag.service";

export default class FlagController {
    static async applyFlagToRequestByUidParam(
        req: Request,
        _res: Response,
        next: NextFunction,
        uid: string,
    ): Promise<Response | void> {
        try {
            const flag = await FlagService.getFlagByUid(uid, req.authenticatedUser?.uid);
            req.flag = flag;
            return next();
        } catch (error) {
            return next(error);
        }
    }

    static async getFlags(
        req: Request,
        res: Response<ApiResponseCollection<Flag>>,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const flags = await FlagService.getFlags(req.authenticatedUser?.uid);
            if (flags.length > 0) {
                return res.status(200).json({ results: flags });
            } else {
                return res.status(204).send();
            }
        } catch (error) {
            return next(error);
        }
    }

    static async getFlagByUid(req: Request, res: Response<Flag>): Promise<Response | void> {
        return req.flag ? res.status(200).json(req.flag) : res.status(204).send();
    }

    static async postFlag(req: Request, res: Response<Flag>, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());

        try {
            const flagPost = FlagPost.parse(req.body);
            const flag = await FlagService.createFlag(flagPost, req.authenticatedUser.uid);
            return res.status(201).json(flag);
        } catch (error) {
            return next(error);
        }
    }

    static async patchFlag(req: Request, res: Response<Flag>, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());
        if (!req.flag) return next(forbiddenResourceAccessError("Flag"));

        try {
            const flagPost = FlagPost.parse(req.body);
            const flag = await FlagService.updateFlag(flagPost, req.flag.uid);
            return res.status(200).json(flag);
        } catch (error) {
            return next(error);
        }
    }

    static async deleteFlag(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());
        if (!req.flag) return next(forbiddenResourceAccessError("Flag"));

        try {
            await FlagService.deleteFlag(req.flag.uid);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
}
