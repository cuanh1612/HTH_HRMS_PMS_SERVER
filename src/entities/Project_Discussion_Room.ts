import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Employee } from './Employee'
import { Project } from './Project'
import { Project_discussion_category } from './Project_Discussion_Category'
import { Project_discussion_reply } from './Project_Discussion_Reply'

@Entity()
export class Project_Discussion_Room extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@OneToMany(
		() => Project_discussion_reply,
		(project_discussion_reply) => project_discussion_reply.project_discussion_room,
		{
			eager: true,
		}
	)
	project_discussion_replies: Project_discussion_reply[]

	@ManyToOne(
		() => Project_discussion_category,
		(project_discussion_category) => project_discussion_category.project_discussion_rooms,
		{
			onDelete: 'CASCADE',
			eager: true,
			nullable: true,
		}
	)
	@JoinColumn()
	project_discussion_category: Project_discussion_category

	@ManyToOne(
		() => Employee,
		(employee) => employee.project_discussion_rooms,
		{
			onDelete: 'CASCADE',
			eager: true,
			nullable: true,
		}
	)
	@JoinColumn()
	assigner: Employee

	@ManyToOne(() => Project, (project) => project.project_discussion_rooms, {
		onDelete: 'CASCADE',
		nullable: true,
	})
	@JoinColumn()
	project: Project

	@Column()
	title: String

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
