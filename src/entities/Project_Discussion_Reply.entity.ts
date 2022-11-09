import {
	BaseEntity, Column, CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne, PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { Employee } from './Employee.entity'
import { Project_Discussion_Room } from './Project_Discussion_Room.entity'

@Entity()
export class Project_discussion_reply extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@ManyToOne(() => Employee, (employee) => employee.project_discussion_replies, {
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn()
	employee: Employee

	@ManyToOne(() => Project_Discussion_Room, (project_discussion_room) => project_discussion_room.project_discussion_replies, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	project_discussion_room: Project_Discussion_Room

	@Column()
	reply: string

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
