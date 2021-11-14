import * as t from "runtypes";
import { TimeStamped } from "./generic";

export const StripText = t.Record({
    uid: t.Optional(t.String),
    value: t.String,
    color: t.String,
    fontFamily: t.String,
    fontWeight: t.Number,
    fontSize: t.String,
});

export const StripTextPost = StripText.omit("uid").asPartial();

export const StripImageOption = t.Record({
    uid: t.String,
    uri: t.String,
    name: t.String,
});

export const StripImage = t.Record({
    uid: t.Optional(t.String),
    size: t.Number,
    imageOption: StripImageOption,
});

export const StripImagePost = t.Intersect(
    StripImage.omit("uid", "imageOption").asPartial(),
    t.Record({ imageOptionuid: t.String }).asPartial(),
);

export const Strip = TimeStamped.extend({
    uid: t.String,
    position: t.Number,
    backgroundColor: t.String,
    text: StripText,
    image: StripImage,
});

export const StripPost = t.Intersect(
    Strip.omit("uid", "text", "image").asPartial(),
    t.Record({ text: StripTextPost, image: StripImagePost }).asPartial(),
);

export type StripText = t.Static<typeof StripText>;
export type StripTextPost = t.Static<typeof StripTextPost>;
export type StripImageOption = t.Static<typeof StripImageOption>;
export type StripImage = t.Static<typeof StripImage>;
export type StripImagePost = t.Static<typeof StripImagePost>;
export type Strip = t.Static<typeof Strip>;
export type StripPost = t.Static<typeof StripPost>;
