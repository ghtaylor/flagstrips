import createHttpError, { HttpError } from "http-errors";

export const missingRequiredFieldError = (field: string): HttpError =>
    createHttpError(400, `The required field ${field} is missing.`, { field });

export const duplicateResourceError = (resource: "User" | "Flag" | "Strip", field: string): HttpError =>
    createHttpError(409, `A ${resource} with the provided ${field} already exists.`, { field });

export const unsuccessfulLoginError = (field: "password" | "email" | "username"): HttpError =>
    createHttpError(401, `Login was unsuccessful. The provided ${field} was incorrect.`, { field });

export const forbiddenResourceAccessError = (resource: "Flag" | "Strip"): HttpError =>
    createHttpError(403, `No access to resource ${resource}.`);

export const parentResourceInvalidError = (parentResource: "Flag"): HttpError =>
    createHttpError(400, `Parent resource does not exist.`, { parentResource });

export const invalidPostBodyError = (): HttpError => createHttpError(400, "Provided request body is invalid.");

export const unauthorizedError = (): HttpError => createHttpError(401, "Unauthorized. Please provide a valid token.");
