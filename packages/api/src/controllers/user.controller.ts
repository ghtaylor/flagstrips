import { User, UserPost } from "@flagstrips/common";
import { NextFunction, Request, Response } from "express";
import { invalidPostBodyError, unauthorizedError } from "../errors";
import UserService from "../services/user.service";

export default class UserController {
    // static async applyUserToRequestByIdParam(
    //     req: Request,
    //     _res: Response,
    //     next: NextFunction,
    //     id: string,
    // ): Promise<Response | void> {
    //     try {
    //         const user = await UserService.getUserById(id);
    //         if (user) {
    //             req.user = user;
    //         }
    //         return next();
    //     } catch (error) {
    //         return next(error);
    //     }
    // }

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
