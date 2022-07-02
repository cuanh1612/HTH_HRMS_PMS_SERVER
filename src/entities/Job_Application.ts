import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Job } from "./Job";
import { Job_application_picture } from "./Job_Application_Picture";
import { Location } from "./Location";


export enum enumStatus{
    APPLIED = 'Applied',
    PHONESCREEN = 'Phone screen',
    INTERVIEW = 'Interview',
    HIRED = 'Hired',
    REJECTED = 'Rejected'
}

export enum enumSource{
    LINKEDIN = 'Linkedin',
    FACEBOOK = 'Facebook',
    INSTAGRAM = 'Instagram',
    TWITTER = 'Twitter',
    OTHER = 'Other'
}

@Entity()
export class Job_Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
    
    @Column()
    name: string

    @Column()
    email: string

    @Column()
    mobile: string

    @OneToOne(() => Job_application_picture, {
		eager: true,
		cascade: true,
	})
	@JoinColumn()
	picture: Job_application_picture

    @Column({nullable: true})
    cover_leter: string

    @Column({ type: 'enum', enum: enumStatus, default: enumStatus.APPLIED})
    status: string

    @Column({ type: 'enum', enum: enumSource, nullable: true})
    source: string

    @ManyToOne(() => Job, (job) => job.job_application,{
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    jobs: Job

    @ManyToOne(() => Location, (location) => location.job_application,{
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    location: Location


    @CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}