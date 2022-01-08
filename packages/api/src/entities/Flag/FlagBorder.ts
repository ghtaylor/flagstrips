import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import FlagEntity from ".";

@Entity({ name: "flag_border" })
export default class FlagBorderEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn()
    uid: string;

    @Column()
    flagUid: string;

    @OneToOne(() => FlagEntity, (flag) => flag.border)
    @JoinColumn({ name: "flag_uid", referencedColumnName: "uid" })
    flag: FlagEntity;

    @Column()
    width: number;

    @Column()
    color: string;

    @Column()
    radius: number;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    modified: Date;
}
