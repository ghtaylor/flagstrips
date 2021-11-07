import { QueryFailedError } from "typeorm";
import { DatabaseError } from "pg-protocol";

export const getDuplicatedFieldByDetailMessage = (detailMessage: string): string => {
    const matches = detailMessage.match(/(?<=\().+?(?=\))/g);
    if (matches && matches.length == 2) {
        return matches[0];
    } else {
        throw new Error("Cannot retrieve 'already exists' field from provided detail message.");
    }
};

export const isQueryFailedError = (err: unknown): err is QueryFailedError & DatabaseError =>
    err instanceof QueryFailedError;
