import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import FlagEntity from ".";

@Entity({ name: "flag_padding" })
export default class FlagPaddingEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @PrimaryGeneratedColumn()
    uid: string;

    @Column()
    flagUid: string;

    @OneToOne(() => FlagEntity, (flag) => flag.padding)
    @JoinColumn({ name: "flag_uid", referencedColumnName: "uid" })
    flag: FlagEntity;

    @Column()
    top: number;

    @Column()
    right: number;

    @Column()
    bottom: number;

    @Column()
    left: number;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    modified: Date;
}
