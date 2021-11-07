import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import StripEntity from ".";

@Entity({ name: "strip_text" })
export default class StripTextEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    value: string;

    @Column()
    color: string;

    @Column()
    fontFamily: string;

    @Column()
    fontWeight: number;

    @Column()
    fontSize: string;

    @Column()
    stripId: string;

    @OneToOne(() => StripEntity, (strip) => strip.image)
    @JoinColumn({ name: "strip_id", referencedColumnName: "id" })
    strip: StripEntity;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    modified: Date;
}
