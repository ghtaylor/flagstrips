import { ApiResponseCollection, Strip, StripImageOption, StripPost } from "@flagstrips/common";
import { NextFunction, Request, Response } from "express";
import { forbiddenResourceAccessError, parentResourceInvalidError, unauthorizedError } from "../errors";
import StripService from "../services/strip.service";

export default class StripController {
    static async applyStripToRequestByUidParam(
        req: Request,
        _res: Response,
        next: NextFunction,
        uid: string,
    ): Promise<Response | void> {
        try {
            const strip = await StripService.getStripByUid(uid, req.authenticatedUser?.uid, req.flag?.uid);
            req.strip = strip;
            return next();
        } catch (error) {
            return next(error);
        }
    }

    static async applyStripImageOptionToRequestByUidParam(
        req: Request,
        _res: Response,
        next: NextFunction,
        uid: string,
    ): Promise<Response | void> {
        try {
            const stripImageOption = await StripService.getStripImageOptionByUid(uid);
            req.stripImageOption = stripImageOption;
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
            const strips = await StripService.getStrips(req.authenticatedUser?.uid, req.flag?.uid);
            if (strips.length > 0) {
                return res.status(200).json({ results: strips });
            } else {
                return res.status(204).send();
            }
        } catch (error) {
            return next(error);
        }
    }

    static async getStripByUid(req: Request, res: Response<Strip>): Promise<Response | void> {
        return req.strip ? res.status(200).json(req.strip) : res.status(204).send();
    }

    static async postStrip(req: Request, res: Response<Strip>, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());
        if (!req.flag) return next(parentResourceInvalidError("Flag"));

        try {
            const stripPost = StripPost.parse(req.body);
            const strip = await StripService.createStrip(stripPost, req.authenticatedUser.uid, req.flag.uid);
            return res.status(201).json(strip);
        } catch (error) {
            return next(error);
        }
    }

    static async patchStrip(req: Request, res: Response<Strip>, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());
        if (!req.strip) return next(forbiddenResourceAccessError("Strip"));

        try {
            const stripPost = StripPost.parse(req.body);
            const strip = await StripService.updateStrip(stripPost, req.strip.uid);
            return res.status(200).json(strip);
        } catch (error) {
            return next(error);
        }
    }

    static async deleteStrip(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());
        if (!req.strip) return next(forbiddenResourceAccessError("Strip"));

        try {
            await StripService.deleteStrip(req.strip.uid);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    }

    static async getStripImageOptions(
        _req: Request,
        res: Response<ApiResponseCollection<StripImageOption>>,
        next: NextFunction,
    ): Promise<Response | void> {
        try {
            const stripImageOptions = await StripService.getStripImageOptions();
            return res.status(200).send({ results: stripImageOptions });
        } catch (error) {
            return next(error);
        }
    }

    static async getStripImageOptionByUid(req: Request, res: Response<StripImageOption>): Promise<Response | void> {
        return req.stripImageOption ? res.status(200).json(req.stripImageOption) : res.status(204).send();
    }
}
