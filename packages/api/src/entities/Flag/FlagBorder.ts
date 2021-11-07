import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import FlagEntity from ".";

@Entity({ name: "flag_border" })
export default class FlagBorderEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    flagId: string;

    @OneToOne(() => FlagEntity, (flag) => flag.border)
    @JoinColumn({ name: "flag_id", referencedColumnName: "id" })
    flag: FlagEntity;

    @Column()
    width: number;

    @Column()
    color: string;

    @Column()
    topLeft: number;

    @Column()
    topRight: number;

    @Column()
    bottomLeft: number;

    @Column()
    bottomRight: number;

    @CreateDateColumn()
    created: Date;

    @CreateDateColumn()
    modified: Date;
}
