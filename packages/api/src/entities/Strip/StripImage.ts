import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import StripEntity from ".";
import StripImageOptionEntity from "./StripImageOption";

@Entity({ name: "strip_image" })
export default class StripImageEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    size: number;

    @Column()
    stripId: string;

    @OneToOne(() => StripEntity, (strip) => strip.image)
    @JoinColumn({ name: "strip_id", referencedColumnName: "id" })
    strip: StripEntity;

    @Column()
    imageOptionId: string;

    @OneToOne(() => StripImageOptionEntity)
    @JoinColumn({ name: "image_option_id", referencedColumnName: "id" })
    imageOption: StripImageOptionEntity;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    modified: Date;
}
