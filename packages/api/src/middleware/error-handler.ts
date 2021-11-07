import { ApiResponseError } from "@flagstrips/common";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

export default (error: Error, _req: Request, res: Response<ApiResponseError>, _next: NextFunction): Response => {
    if (error instanceof HttpError) {
        const { status, message, statusCode, expose, headers, name, stack, ...additionalData } = error;
        return res
            .status(status)
            .send(Object.entries(additionalData).length === 0 ? { message } : { message, additionalData });
    } else {
        const { message } = error;
        return res.status(500).send({ message });
    }
};
