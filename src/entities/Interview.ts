import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Employee } from './Employee'
import { Job_Application } from './Job_Application'

enum enumType {
	INPERSON = 'In Person',
	VIDEO = 'Video',
	PHONE = 'Phone',
}

enum enumStatus {
	PENDING = 'Pending',
	HIRED = 'Hired',
	COMPLETED = 'Completed',
	CANCELED = 'Canceled',
	REJECTED = 'Rejected',
}

@Entity()
export class Interview extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ type: 'date' })
	date: Date

	@ManyToOne(() => Job_Application, (jobApplication) => jobApplication.interviews, {
		cascade: true,
	})
	@JoinColumn()
	candidate: Job_Application

	@ManyToOne(() => Employee, (employee) => employee.interviews, {
		cascade: true,
	})
	@JoinColumn()
	interviewer: Employee

	@Column('text')
	comment!: string

	@Column('time')
	start_time!: string

	@Column({ type: 'enum', enum: enumType, default: enumType.INPERSON })
	type: string

	@Column({ type: 'enum', enum: enumStatus, default: enumStatus.PENDING })
	status: string

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
