import * as t from "runtypes";
import { TimeStamped } from "./generic";
import { Strip, StripPost } from "./strip";
import { Uuid } from "./util";

export const FlagBorder = t.Record({
    id: t.Optional(Uuid),
    width: t.Number,
    color: t.String,
    topLeft: t.Number,
    topRight: t.Number,
    bottomLeft: t.Number,
    bottomRight: t.Number,
});

export const FlagBorderPost = FlagBorder.omit("id").asPartial();

export const FlagPadding = t.Record({
    id: t.Optional(Uuid),
    top: t.Number,
    right: t.Number,
    bottom: t.Number,
    left: t.Number,
});

export const FlagPaddingPost = FlagPadding.omit("id").asPartial();

export const Flag = TimeStamped.extend({
    id: Uuid,
    title: t.String,
    border: FlagBorder,
    padding: FlagPadding,
    strips: t.Array(Strip),
});

export const FlagPost = t.Intersect(
    Flag.omit("id", "border", "padding", "strips").asPartial(),
    t
        .Record({
            border: FlagBorderPost,
            padding: FlagPaddingPost,
            strips: t.Array(StripPost),
        })
        .asPartial(),
);

export type FlagBorder = t.Static<typeof FlagBorder>;
export type FlagBorderPost = t.Static<typeof FlagBorderPost>;
export type FlagPadding = t.Static<typeof FlagPadding>;
export type FlagPaddingPost = t.Static<typeof FlagPaddingPost>;
export type Flag = t.Static<typeof Flag>;
export type FlagPost = t.Static<typeof FlagPost>;
