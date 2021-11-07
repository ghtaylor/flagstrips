import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import StripEntity from "../Strip";
import UserEntity from "../User";
import FlagBorderEntity from "./FlagBorder";
import FlagPaddingEntity from "./FlagPadding";

@Entity({ name: "flag" })
export default class FlagEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ name: "user_account_id" })
    userId: string;

    @ManyToOne(() => UserEntity, (user) => user.flags)
    @JoinColumn({ name: "user_account_id", referencedColumnName: "id" })
    user: UserEntity;

    @OneToMany(() => StripEntity, (strip) => strip.flag)
    strips: StripEntity[];

    @Column()
    title: string;

    @OneToOne(() => FlagBorderEntity, (flagBorder) => flagBorder.flag)
    border: FlagBorderEntity;

    @OneToOne(() => FlagPaddingEntity, (flagPadding) => flagPadding.flag)
    padding: FlagPaddingEntity;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    modified: Date;
}
