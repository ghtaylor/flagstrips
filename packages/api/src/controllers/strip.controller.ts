import { ApiResponseCollection, getLeafPathsOfRecord, Strip, StripPost } from "@flagstrips/common";
import { NextFunction, Request, Response } from "express";
import { pick } from "lodash";
import {
    forbiddenResourceAccessError,
    invalidPostBodyError,
    parentResourceInvalidError,
    unauthorizedError,
} from "../errors";
import StripService from "../services/strip.service";

export default class StripController {
    static async applyStripToRequestByIdParam(
        req: Request,
        _res: Response,
        next: NextFunction,
        id: string,
    ): Promise<Response | void> {
        try {
            console.log("applying");
            console.log("flag", req.flag);

            const strip = await StripService.getStripById(id, req.authenticatedUser?.id, req.flag?.id);
            if (strip) {
                req.strip = strip;
            }
            return next();
        } catch (error) {
            return next(error);
        }
    }

    static async getStrips(
        req: Request,
        res: Response<ApiResponseCollection<Strip>>,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const strips = await StripService.getStrips(req.authenticatedUser?.id, req.flag?.id);
            if (strips.length > 0) {
                return res.status(200).json({ results: strips });
            } else {
                return res.status(204).send();
            }
        } catch (error) {
            return next(error);
        }
    }

    static async getStripById(req: Request, res: Response<Strip>): Promise<Response | void> {
        return req.strip ? res.status(200).json(req.strip) : res.status(204).send();
    }

    static async postStrip(req: Request, res: Response<Strip>, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());
        if (!req.flag) return next(parentResourceInvalidError("Flag"));

        const body = pick(req.body, getLeafPathsOfRecord(StripPost));

        if (StripPost.guard(body)) {
            try {
                const strip = await StripService.createStrip(body, req.authenticatedUser.id, req.flag.id);
                return res.status(201).json(strip);
            } catch (error) {
                return next(error);
            }
        } else {
            return next(invalidPostBodyError());
        }
    }

    static async patchStrip(req: Request, res: Response<Strip>, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());
        if (!req.strip) return next(forbiddenResourceAccessError("Strip"));

        const body = pick(req.body, getLeafPathsOfRecord(StripPost));

        if (StripPost.guard(body)) {
            try {
                const strip = await StripService.updateStrip(body, req.strip.id);
                return res.status(200).json(strip);
            } catch (error) {
                return next(error);
            }
        } else {
            return next(invalidPostBodyError());
        }
    }

    static async deleteStrip(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());
        if (!req.strip) return next(forbiddenResourceAccessError("Strip"));

        try {
            await StripService.deleteStrip(req.strip.id);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }
}
