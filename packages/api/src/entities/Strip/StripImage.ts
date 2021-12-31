import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import StripEntity from ".";
import StripImageOptionEntity from "./StripImageOption";

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
    position: string;

    @Column()
    stripUid: string;

    @OneToOne(() => StripEntity, (strip) => strip.image)
    @JoinColumn({ name: "strip_uid", referencedColumnName: "uid" })
    strip: StripEntity;

    @Column()
    imageOptionUid: string;

    @OneToOne(() => StripImageOptionEntity)
    @JoinColumn({ name: "image_option_uid", referencedColumnName: "uid" })
    imageOption: StripImageOptionEntity;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    modified: Date;
}
