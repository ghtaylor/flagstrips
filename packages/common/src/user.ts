import * as t from "runtypes";
import { TimeStamped } from "./generic";
import { Uuid } from "./util";

export const UserRole = t.Record({
    name: t.String,
});

export type UserRole = t.Static<typeof UserRole>;

export const UserLoginBase = t.Record({
    password: t.String,
});

export const UserLoginEmail = UserLoginBase.extend({
    email: t.String,
});

export const UserLoginUsername = UserLoginBase.extend({
    username: t.String,
});

export const UserLogin = t.Union(UserLoginEmail, UserLoginUsername);

export type UserLogin = t.Static<typeof UserLogin>;

export const UserWithPassword = TimeStamped.extend({
    id: Uuid,
    email: t.String,
    username: t.String,
    password: t.String,
    firstName: t.Optional(t.String),
    lastName: t.Optional(t.String),
    roleName: t.String,
});

export type UserWithPassword = t.Static<typeof UserWithPassword>;

export const User = UserWithPassword.omit("password");

export type User = t.Static<typeof User>;

export const UserPost = UserWithPassword.omit("id", "roleName");

export type UserPost = t.Static<typeof UserPost>;
