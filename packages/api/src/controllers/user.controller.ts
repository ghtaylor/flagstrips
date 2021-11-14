import { User, UserPost } from "@flagstrips/common";
import { NextFunction, Request, Response } from "express";
import { invalidPostBodyError, unauthorizedError } from "../errors";
import UserService from "../services/user.service";

export default class UserController {
    static async getAuthenticatedUser(req: Request, res: Response<User>, next: NextFunction): Promise<Response | void> {
        if (!req.authenticatedUser) return next(unauthorizedError());
        return res.status(200).json(req.authenticatedUser);
    }

    static async postUser(req: Request, res: Response<User>, next: NextFunction): Promise<Response | void> {
        if (UserPost.guard(req.body)) {
            const userPost = req.body;
            try {
                const user = await UserService.postUser(userPost);
                return res.status(201).json(user);
            } catch (error) {
                return next(error);
            }
        } else {
            return next(invalidPostBodyError());
        }
    }
}
