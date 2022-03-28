import FlagEntity from "../../entities/Flag";
import UserEntity from "../../entities/User";

export type DBTestDataResult = {
    userUid: string;
    flagUid: string;
};

const insertDbTestData = async (): Promise<DBTestDataResult> => {
    const { uid: userUid } = await UserEntity.create({
        username: "test",
        email: "test@test.com",
        password: "test123",
    }).save();

    const { uid: flagUid } = await FlagEntity.create({
        userUid,
    }).save();

    return { userUid, flagUid };
};

export default insertDbTestData;
