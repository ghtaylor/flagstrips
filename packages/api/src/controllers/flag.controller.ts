import { ApiResponseCollection, Flag, FlagPost, getLeafPathsOfRecord } from "@flagstrips/common";
import { NextFunction, Request, Response } from "express";
import { omit, pick } from "lodash";
import { forbiddenResourceAccessError, invalidPostBodyError, unauthorizedError } from "../errors";
import FlagService from "../services/flag.service";

export default class FlagController {
    static async applyFlagToRequestByIdParam(
        req: Request,
        _res: Response,
        next: NextFunction,
        id: string,
    ): Promise<Response | void> {
        try {
            const flag = await FlagService.getFlagById(id, req.authenticatedUser?.id);
            if (flag) {
                req.flag = flag;
            }
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
            const flags = await FlagService.getFlags(req.authenticatedUser?.id);
            if (flags.length > 0) {
                return res.status(200).json({ results: flags });
            } else {
                return res.status(204).send();
            }
        } catch (error) {
            return next(error);
        }
    }

    static async getFlagById(req: Request, res: Response<Flag>): Promise<Response | void> {
        return req.flag ? res.status(200).json(req.flag) : res.status(204).send();
    }

    static async postFlag(req: Request, res: Response<Flag>, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());

        const body = pick(req.body, getLeafPathsOfRecord(FlagPost));

        if (FlagPost.guard(body)) {
            try {
                const flag = await FlagService.createFlag(body, req.authenticatedUser.id);
                return res.status(201).json(flag);
            } catch (error) {
                return next(error);
            }
        } else {
            return next(invalidPostBodyError());
        }
    }

    static async patchFlag(req: Request, res: Response<Flag>, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());
        if (!req.flag) return next(forbiddenResourceAccessError("Flag"));

        let body = pick(req.body, getLeafPathsOfRecord(FlagPost));
        body = omit(body, "strips");

        if (FlagPost.guard(body)) {
            try {
                const flag = await FlagService.updateFlag(body, req.flag.id);
                return res.status(200).json(flag);
            } catch (error) {
                return next(error);
            }
        } else {
            return next(invalidPostBodyError());
        }
    }

    static async deleteFlag(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());
        if (!req.flag) return next(forbiddenResourceAccessError("Flag"));

        try {
            await FlagService.deleteFlag(req.flag.id);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
}
