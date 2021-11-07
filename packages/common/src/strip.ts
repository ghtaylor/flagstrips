import * as t from "runtypes";
import { TimeStamped } from "./generic";
import { Uuid } from "./util";

export const StripText = t.Record({
    id: t.Optional(Uuid),
    value: t.String,
    color: t.String,
    fontFamily: t.String,
    fontWeight: t.Number,
    fontSize: t.String,
});

export const StripTextPost = StripText.omit("id").asPartial();

export const StripImageOption = t.Record({
    id: Uuid,
    uri: t.String,
    name: t.String,
});

export const StripImage = t.Record({
    id: t.Optional(Uuid),
    size: t.Number,
    imageOption: StripImageOption,
});

export const StripImagePost = t.Intersect(
    StripImage.omit("id", "imageOption").asPartial(),
    t.Record({ imageOptionId: Uuid }).asPartial(),
);

export const Strip = TimeStamped.extend({
    id: Uuid,
    position: t.Number,
    backgroundColor: t.String,
    text: StripText,
    image: StripImage,
});

export const StripPost = t.Intersect(
    Strip.omit("id", "text", "image").asPartial(),
    t.Record({ text: StripTextPost, image: StripImagePost }).asPartial(),
);

export type StripText = t.Static<typeof StripText>;
export type StripTextPost = t.Static<typeof StripTextPost>;
export type StripImageOption = t.Static<typeof StripImageOption>;
export type StripImage = t.Static<typeof StripImage>;
export type StripImagePost = t.Static<typeof StripImagePost>;
export type Strip = t.Static<typeof Strip>;
export type StripPost = t.Static<typeof StripPost>;
