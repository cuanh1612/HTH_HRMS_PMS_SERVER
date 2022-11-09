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
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Employee } from './Employee.entity'
import { Interview_file } from './Interview_File.entity'
import { Job_Application } from './Job_Application.entity'

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
		onDelete: "CASCADE"
	})
	@JoinColumn()
	candidate: Job_Application

	@ManyToMany(() => Employee, { onDelete: 'CASCADE' })
	@JoinTable({ name: 'interview_employee' })
	interviewer: Employee[]

	@Column('text', {nullable: true})
	comment: string

	@Column('time')
	start_time!: string

	@Column({ type: 'enum', enum: enumType, default: enumType.INPERSON })
	type: string

	@Column({ type: 'enum', enum: enumStatus, default: enumStatus.PENDING })
	status: string

	@OneToMany(() => Interview_file, (Interview_file) => Interview_file.interview,{
        onDelete: 'SET NULL',
        nullable: true
    })
    interview_files: Interview_file[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
