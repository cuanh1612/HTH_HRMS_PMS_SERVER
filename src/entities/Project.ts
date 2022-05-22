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
	UpdateDateColumn
} from 'typeorm'
import { Client } from './Client'
import { Department } from './Department'
import { Employee } from './Employee'
import { Project_Category } from './Project_Category'
import { Project_Discussion_Room } from './Project_Discussion_Room'
import { Project_file } from './Project_File'
import { Project_note } from './Project_Note'
import { Status } from './Status'
import { Task } from './Task'

export enum enumCurrency {
	USD = 'USD',
	GBP = 'GBP',
	EUR = 'EUR',
	INR = 'INR',
	VND = 'VND',
}



@Entity()
export class Project extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ unique: true })
	name!: string

	@Column({ type: 'date' })
	start_date!: Date

	@Column({ type: 'date' })
	deadline: Date

	@Column({ nullable: true })
	project_summary: string

	@Column({ nullable: true })
	notes: string

	@Column({ nullable: true })
	project_budget: number

	@Column({ nullable: true })
	hours_estimate: number

	@Column({ type: 'boolean', default: false })
	send_task_noti: boolean

	@ManyToOne(() => Project_Category, (project_Category) => project_Category.projects, {
		onDelete: 'SET NULL',
		nullable: true,

	})
	@JoinColumn()
	project_category: Project_Category

	@ManyToOne(() => Department, (department) => department.projects, {
		onDelete: 'SET NULL',
		nullable: true,

	})
	@JoinColumn()
	department: Department

	@ManyToOne(() => Client, (client) => client.projects, {
		onDelete: 'SET NULL',
		nullable: true,

	})
	@JoinColumn()
	client: Client

	@ManyToMany(() => Employee, { onDelete: 'CASCADE', eager: true })
	@JoinTable({ name: 'project_employee' })
	employees: Employee[]


	@Column({ type: 'enum', enum: enumCurrency, default: enumCurrency.USD })
	currency: string

	@Column({ default: 0 })
	Progress: number

	@ManyToOne(() => Employee, (Employee) => Employee.projects, {
		onDelete: 'SET NULL',

	})
	@JoinColumn()
	Added_by: Employee

	@OneToMany(() => Project_file, (project_file) => project_file.project, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	project_files: Project_file[]

	@OneToMany(() => Project_Discussion_Room, (project_Discussion_Room) => project_Discussion_Room.project, {
		onDelete: 'SET NULL',
		nullable: true,
	})
	project_discussion_rooms: Project_Discussion_Room[]

	@OneToMany(() => Status, (status) => status.project)
	status: Status

	@OneToMany(() => Task, (task) => task.project, {
		onDelete: "SET NULL"
	})
	tasks: Task[]

	@OneToMany(() => Project_note, (project_notice) => project_notice.project, {
		onDelete: 'SET NULL',
	})
	project_notes: Project_note[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
