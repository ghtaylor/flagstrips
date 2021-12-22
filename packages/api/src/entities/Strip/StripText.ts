import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import StripEntity from ".";

@Entity({ name: "strip_text" })
export default class StripTextEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn()
    uid: string;

    @Column()
    value: string;

    @Column()
    color: string;

    @Column()
    fontFamily: string;

    @Column()
    fontWeight: string;

    @Column()
    fontSize: number;

    @Column()
    stripUid: string;

    @OneToOne(() => StripEntity, (strip) => strip.image)
    @JoinColumn({ name: "strip_uid", referencedColumnName: "uid" })
    strip: StripEntity;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    modified: Date;
}
