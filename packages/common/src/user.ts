import { z } from "zod";
import { TimeStamped } from "./generic";

export const UserRole = z.object({
    name: z.string(),
});

export type UserRole = z.infer<typeof UserRole>;

export const UserLoginBase = z.object({
    password: z.string(),
});

export const UserLoginEmail = UserLoginBase.extend({
    email: z.string(),
});

export const UserLoginUsername = UserLoginBase.extend({
    username: z.string(),
});

export const UserLogin = z.union([UserLoginEmail, UserLoginUsername]);

export type UserLogin = z.infer<typeof UserLogin>;

export const UserWithPassword = TimeStamped.extend({
    uid: z.string(),
    email: z.string(),
    username: z.string(),
    password: z.string(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    roleName: z.string(),
});

export type UserWithPassword = z.infer<typeof UserWithPassword>;

export const User = UserWithPassword.omit({ password: true });

export type User = z.infer<typeof User>;

export const UserPost = UserWithPassword.omit({ uid: true, roleName: true, created: true, modified: true });

export type UserPost = z.infer<typeof UserPost>;
