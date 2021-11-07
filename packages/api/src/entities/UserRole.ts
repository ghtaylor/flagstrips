import { BaseEntity, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "user_role" })
export default class UserRoleEntity extends BaseEntity {
    @PrimaryColumn()
    name: string;
}
