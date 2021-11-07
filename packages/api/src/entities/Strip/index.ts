import { StripText } from "@flagstrips/common";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import FlagEntity from "../Flag";
import UserEntity from "../User";
import StripImageEntity from "./StripImage";
import StripTextEntity from "./StripText";

@Entity({ name: "strip" })
export default class StripEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    flagId: string;

    @Column({ name: "user_account_id" })
    userId: string;

    @ManyToOne(() => UserEntity, (user) => user.flags)
    @JoinColumn({ name: "user_account_id", referencedColumnName: "id" })
    user: UserEntity;

    @ManyToOne(() => FlagEntity, (flag) => flag.strips)
    flag: FlagEntity;

    @OneToOne(() => StripImageEntity, (stripImage) => stripImage.strip)
    image: StripImageEntity;

    @OneToOne(() => StripTextEntity, (stripText) => stripText.strip)
    text: StripText;

    @Column()
    backgroundColor: string;

    @Column()
    position: number;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    modified: Date;
}
