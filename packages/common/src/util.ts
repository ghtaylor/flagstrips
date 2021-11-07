import * as t from "runtypes";
import isUUID from "validator/lib/isUUID";
import { RuntypeBase } from "runtypes/lib/runtype";

export const getLeafPathsOfRecord = (
    runtype: RuntypeBase<unknown>,
    parentKey: string | undefined = undefined,
): string[] => {
    let paths: string[] = [];
    if (runtype.reflect.tag === "intersect") {
        paths = [
            ...paths,
            ...runtype.reflect.intersectees.flatMap((intersectee) => getLeafPathsOfRecord(intersectee, parentKey)),
        ];
    } else if (runtype.reflect.tag === "record") {
        const { fields } = runtype.reflect;
        Object.keys(fields).forEach((field) => {
            const value = fields[field];
            const key = parentKey ? `${parentKey}.${field}` : field;
            if (value.tag === "intersect") {
                paths = [
                    ...paths,
                    ...value.intersectees.flatMap((intersectee) => getLeafPathsOfRecord(intersectee, key)),
                ];
            } else if (value.tag === "record") {
                paths = [...paths, ...getLeafPathsOfRecord(value, key)];
            } else {
                paths.push(key);
            }
        });
    }
    return paths;
};

export const Uuid = t.String.withConstraint((value) => isUUID(value) || `${value} is not a UUID.`);
export type Uuid = t.Static<typeof Uuid>;
