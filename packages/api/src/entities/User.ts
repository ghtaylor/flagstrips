import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import FlagEntity from "./Flag";
import StripEntity from "./Strip";
import UserRoleEntity from "./UserRole";

@Entity({ name: "user_account" })
export default class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @PrimaryColumn()
    username: string;

    @PrimaryColumn()
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    modified: Date;

    @OneToMany(() => FlagEntity, (flag) => flag.user)
    @JoinColumn()
    flags: FlagEntity[];

    @OneToMany(() => StripEntity, (strip) => strip.user)
    @JoinColumn()
    strips: StripEntity[];

    @Column()
    roleName: string;

    @ManyToOne(() => UserRoleEntity)
    @JoinColumn({ name: "role_name", referencedColumnName: "name" })
    role: UserRoleEntity;
}
