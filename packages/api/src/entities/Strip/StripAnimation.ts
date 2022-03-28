import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import StripEntity from ".";
import AnimationPresetOptionEntity from "../Animation/AnimationPresetOption";

class StripAnimationEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn()
    uid: string;

    @Column()
    easing: string;

    @Column({ name: "preset_option_uid" })
    presetUid: string;

    @Column()
    stripUid: string;

    @OneToOne(() => AnimationPresetOptionEntity)
    @JoinColumn({ name: "preset_option_uid", referencedColumnName: "uid" })
    preset: AnimationPresetOptionEntity;

    @Column()
    duration: number;
}

@Entity({ name: "strip_animation_in" })
export class InStripAnimationEntity extends StripAnimationEntity {
    @OneToOne(() => StripEntity, (strip) => strip.inAnimation)
    @JoinColumn({ name: "strip_uid", referencedColumnName: "uid" })
    strip: StripEntity;
}

@Entity({ name: "strip_animation_static" })
export class StaticStripAnimationEntity extends StripAnimationEntity {
    @OneToOne(() => StripEntity, (strip) => strip.staticAnimation)
    @JoinColumn({ name: "strip_uid", referencedColumnName: "uid" })
    strip: StripEntity;
}

@Entity({ name: "strip_animation_out" })
export class OutStripAnimationEntity extends StripAnimationEntity {
    @OneToOne(() => StripEntity, (strip) => strip.outAnimation)
    @JoinColumn({ name: "strip_uid", referencedColumnName: "uid" })
    strip: StripEntity;
}
