import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "animation_preset_option" })
export default class AnimationPresetOptionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn()
    uid: string;

    @Column()
    name: string;

    @Column({ type: "jsonb" })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animeJson: Record<string, any>;

    @Column()
    direction: string;
}
