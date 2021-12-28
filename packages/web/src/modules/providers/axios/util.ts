/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
const isoDateFormat = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/;

const isIsoDateString = (value: unknown): boolean =>
    value !== null && value !== undefined && typeof value === "string" && isoDateFormat.test(value);

export const handleDates = (body: any): any => {
    if (body === null || body === undefined || typeof body !== "object") return body;

    for (const key of Object.keys(body)) {
        const value = body[key];
        if (isIsoDateString(value)) body[key] = new Date(value);
        else if (typeof value === "object") handleDates(value);
    }
};
