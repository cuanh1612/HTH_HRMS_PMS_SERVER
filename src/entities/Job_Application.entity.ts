import { Interview } from './Interview.entity'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { Job } from './Job.entity'
import { Job_application_picture } from './Job_Application_Picture.entity'
import { Location } from './Location.entity'
import { Skill } from './Skill.entity'
import { Job_application_file } from './Job_Application_File.entity'
import { Job_offer_letter } from './Job_Offer_Letter.entity'

export enum enumStatus {
	APPLIED = 'Applied',
	PHONESCREEN = 'Phone screen',
	INTERVIEW = 'Interview',
	HIRED = 'Hired',
	REJECTED = 'Rejected',
}

export enum enumSource {
	LINKEDIN = 'Linkedin',
	FACEBOOK = 'Facebook',
	INSTAGRAM = 'Instagram',
	TWITTER = 'Twitter',
	OTHER = 'Other',
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

	@Column({ nullable: true })
	cover_leter: string

	@Column({ type: 'enum', enum: enumStatus, default: enumStatus.APPLIED })
	status: string

	@Column({ type: 'enum', enum: enumSource, nullable: true })
	source: string

	@ManyToOne(() => Job, (job) => job.job_application, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	jobs: Job

	@OneToMany(() => Job_offer_letter, (Job_offer_letter) => Job_offer_letter.job,{
        onDelete:'SET NULL'
    })
    job_offer_letters: Job_offer_letter[]

	@ManyToOne(() => Location, (location) => location.job_application, {
		onDelete: 'SET NULL',
	})
	@JoinColumn()
	location: Location

	@OneToMany(() => Interview, (interview) => interview.candidate)
	interviews: Interview[]
	@ManyToMany(() => Skill, { eager: true, onDelete: 'CASCADE', nullable: true })
	@JoinTable({ name: 'job_application_skill' })
	skills: Skill[]

	@OneToMany(() => Job_application_file, (Job_application_file) => Job_application_file.job_application,{
        onDelete: 'SET NULL',
        nullable: true
    })
    job_application_files: Job_application_file[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
