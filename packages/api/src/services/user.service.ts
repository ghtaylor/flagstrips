import { User, UserPost, UserWithPassword } from "@flagstrips/common";
import { PostgresError } from "pg-error-enum";
import UserEntity from "../entities/User";
import { duplicateResourceError, missingRequiredFieldError } from "../errors";
import { isQueryFailedError } from "../util";
import { hashPassword } from "../util/auth";
import { getDuplicatedFieldByDetailMessage } from "../util/pg";

const relations: (keyof UserEntity)[] = ["role"];

export const applyPasswordHash = async (userCreate: UserPost): Promise<UserPost> => ({
    ...userCreate,
    password: await hashPassword(userCreate.password),
});

export const transformUserEntityToUser = (userEntity: UserEntity): User => {
    const user = User.parse(userEntity);
    return user as User;
};

export default class UserService {
    static async getUsers(): Promise<User[]> {
        const userEntities = await UserEntity.find({ relations });
        return userEntities.map(transformUserEntityToUser);
    }

    static async getUserByUid(uid: string): Promise<User | undefined> {
        const userEntity = await UserEntity.findOne({ where: { uid }, relations });
        return userEntity ? transformUserEntityToUser(userEntity) : undefined;
    }

    static async getUserWithPasswordByEmail(email: string): Promise<UserWithPassword | undefined> {
        const userEntity = await UserEntity.findOne({ where: { email }, relations });
        return userEntity ? UserWithPassword.parse(userEntity) : undefined;
    }

    static async getUserWithPasswordByUsername(username: string): Promise<UserWithPassword | undefined> {
        const userEntity = await UserEntity.findOne({ where: { username }, relations });
        return userEntity ? UserWithPassword.parse(userEntity) : undefined;
    }

    static async postUser(userPost: UserPost): Promise<User> {
        try {
            const userEntity = await UserEntity.create(await applyPasswordHash(userPost)).save();
            return transformUserEntityToUser(userEntity);
        } catch (error) {
            if (isQueryFailedError(error)) {
                switch (error.code) {
                    case PostgresError.NOT_NULL_VIOLATION:
                        throw missingRequiredFieldError(error.column!);
                    case PostgresError.UNIQUE_VIOLATION:
                        throw duplicateResourceError("User", getDuplicatedFieldByDetailMessage(error.detail!));
                }
            }
            throw error;
        }
    }
}
