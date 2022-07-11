import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { Job } from './Job'
import { Job_Application } from './Job_Application'
import { Sign } from './Sign'

export enum enumStatus {
	PENDING = 'Pending',
	DRAFT = 'Draft',
	WITHDRAW = 'Withdraw',
}

export enum enumRate {
	PER_HOUR = 'Per Hour',
	PER_DAY = 'Per Day',
	PER_WEEK = 'Per Week',
    PER_MONTH = 'Per Month',
    PER_YEAR= 'Per Year',
}


@Entity()
export class Job_offer_letter extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@ManyToOne(() => Job, (job) => job.job_offer_letters, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	job: Job

	@ManyToOne(() => Job_Application, (job_application) => job_application.job_offer_letters, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	job_application: Job_Application

	@Column({ type: 'date' })
	exprise_on: Date

	@Column({ type: 'date' })
	expected_joining_date: Date

    @Column({ default: 0 })
	salary: number

    @Column({ type: 'enum', enum: enumStatus, default: enumStatus.PENDING })
	status: string

    @Column({ type: 'enum', enum: enumRate, default: enumRate.PER_HOUR })
	rate: string

	@OneToOne(() => Sign, {
		cascade: true,
		eager: true,
		nullable: true
	})
	@JoinColumn()
	sign: Sign

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
