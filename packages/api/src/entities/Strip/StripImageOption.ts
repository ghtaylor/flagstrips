import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "strip_image_option" })
export default class StripImageOptionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn()
    uid: string;

    @Column()
    uri: string;

    @Column()
    name: string;
}
