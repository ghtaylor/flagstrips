import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import StripEntity from ".";

@Entity({ name: "strip_image" })
export default class StripImageEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn()
    uid: string;

    @Column()
    size: number;

    @Column()
    color: string;

    @Column()
    gapToText: number;

    @Column()
    position: string;

    @Column()
    stripUid: string;

    @OneToOne(() => StripEntity, (strip) => strip.image)
    @JoinColumn({ name: "strip_uid", referencedColumnName: "uid" })
    strip: StripEntity;

    @Column({ name: "image_option_uid" })
    optionUid: string;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    modified: Date;
}
