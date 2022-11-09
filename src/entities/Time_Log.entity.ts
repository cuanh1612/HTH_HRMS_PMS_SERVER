import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { Employee } from './Employee.entity'
import { Project } from './Project.entity'
import { Task } from './Task.entity'

@Entity()
export class Time_log extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@ManyToOne(() => Project, (project) => project.time_logs, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	project: Project

	@ManyToOne(() => Task, (task) => task.time_logs, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	task: Task

	@ManyToOne(() => Employee, (employee) => employee.time_logs, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	employee: Employee

	@Column({ type: 'date' })
	starts_on_date: Date

	@Column({ type: 'date' })
	ends_on_date: Date

	@Column({ type: "time" })
	starts_on_time: string

	@Column({ type: "time" })
	ends_on_time: string

	@Column()
	memo: string

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date

	@Column({default: 0})
	total_hours: number

	@Column('float',{default: 0})
	earnings: Number
}
