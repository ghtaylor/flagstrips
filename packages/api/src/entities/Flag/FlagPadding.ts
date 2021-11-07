import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import FlagEntity from ".";

@Entity({ name: "flag_padding" })
export default class FlagPaddingEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    flagId: string;

    @OneToOne(() => FlagEntity, (flag) => flag.padding)
    @JoinColumn({ name: "flag_id", referencedColumnName: "id" })
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
