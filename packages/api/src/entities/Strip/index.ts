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
import { InStripAnimationEntity, OutStripAnimationEntity, StaticStripAnimationEntity } from "./StripAnimation";
import StripImageEntity from "./StripImage";
import StripTextEntity from "./StripText";

@Entity({ name: "strip" })
export default class StripEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn()
    uid: string;

    @Column()
    flagUid: string;

    @Column({ name: "user_account_uid" })
    userUid: string;

    @ManyToOne(() => UserEntity, (user) => user.flags)
    @JoinColumn({ name: "user_account_uid", referencedColumnName: "uid" })
    user: UserEntity;

    @ManyToOne(() => FlagEntity, (flag) => flag.strips)
    @JoinColumn({ name: "flag_uid", referencedColumnName: "uid" })
    flag: FlagEntity;

    @OneToOne(() => StripImageEntity, (stripImage) => stripImage.strip)
    image: StripImageEntity;

    @OneToOne(() => StripTextEntity, (stripText) => stripText.strip)
    text: StripTextEntity;

    @OneToOne(() => InStripAnimationEntity, (inStripAnimation) => inStripAnimation.strip)
    inAnimation: InStripAnimationEntity;

    @OneToOne(() => StaticStripAnimationEntity, (staticStripAnimation) => staticStripAnimation.strip)
    staticAnimation: StaticStripAnimationEntity;

    @OneToOne(() => OutStripAnimationEntity, (outStripAnimation) => outStripAnimation.strip)
    outAnimation: OutStripAnimationEntity;

    @Column()
    backgroundColor: string;

    @Column()
    position: number;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    modified: Date;
}
