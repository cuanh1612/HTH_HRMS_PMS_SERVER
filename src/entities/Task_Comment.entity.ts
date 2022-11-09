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
import { Task } from './Task.entity'

@Entity()
export class Task_comment extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	content: string

	@ManyToOne(() => Employee, (employee) => employee.discussions, {
		onDelete: 'SET NULL',
        nullable: true
	})
	@JoinColumn()
	employee: Employee

	@ManyToOne(() => Task, (task) => task.task_comments, {
		onDelete: 'SET NULL',
	})
	@JoinColumn()
	task: Task

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
