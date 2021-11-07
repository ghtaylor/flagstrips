import * as t from "runtypes";

export const TimeStamped = t.Record({
    created: t.InstanceOf(Date),
    modified: t.InstanceOf(Date),
});

export type TimeStamped = t.Static<typeof TimeStamped>;
