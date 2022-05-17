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
	UpdateDateColumn
} from 'typeorm'
import { Attendance } from './Attendance'
import { Avatar } from './Avatar'
import { Conversation } from './Conversation'
import { Conversation_reply } from './Conversation_Reply'
import { Department } from './Department'
import { Designation } from './Designation'
import { Discussion } from './Discussion'
import { Event } from './Event'
import { Leave } from './Leave'
import { Project } from './Project'
import { Project_discussion_reply } from './Project_Discussion_Reply'
import { Project_Discussion_Room } from './Project_Discussion_Room'
import { Task } from './Task'

export enum enumGender {
	MALE = 'Male',
	FEMAILE = 'Female',
	OTHER = 'Others',
}

export enum enumRole {
	ADMIN = 'Admin',
	EMPLOYEE = 'Employee',
	MANAGER = 'Manager',
}

@Entity()
export class Employee extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ unique: true })
	employeeId!: string

	@Column()
	name!: string

	@Column({ unique: true })
	email!: string

	@Column({
		select: false
	})
	password!: string

	@Column({ nullable: true })
	country: string

	@Column({ nullable: true })
	mobile: string

	@Column({ type: 'enum', enum: enumGender })
	gender: string

	@Column({ type: 'date' })
	joining_date!: Date

	@Column({ type: 'date', nullable: true })
	date_of_birth: Date

	@Column({ nullable: true })
	address: string

	@Column()
	can_login!: boolean

	@Column()
	can_receive_email!: boolean

	@Column()
	hourly_rate!: number

	@Column('text', { array: true, default: [] })
	skills: string[]

	@Column({ type: 'enum', enum: enumRole, default: enumRole.EMPLOYEE })
	role: string

	@OneToOne(() => Avatar, {
		cascade: true,
		eager: true,
	})
	@JoinColumn()
	avatar: Avatar

	@ManyToOne(() => Designation, (designation) => designation.employees, {
		onDelete: 'SET NULL',
		eager: true,
	})
	@JoinColumn()
	designation: Designation

	@ManyToOne(() => Department, (department) => department.employees, {
		onDelete: 'SET NULL',
		eager: true,
	})
	@JoinColumn()
	department: Department

	@OneToMany(() => Leave, (leave) => leave.employee)
	leaves: Leave[]

	@OneToMany(() => Attendance, (attendance) => attendance.employee, {
		eager: true
	})
	attendances: Attendance[]

	@OneToMany(() => Conversation_reply, (conversation_reply) => conversation_reply.user)
	conversation_replies: Conversation_reply[]

	@ManyToMany(() => Conversation)
	@JoinTable({ name: 'conversation_employee' })
	conversations: Conversation[];

	@ManyToMany(() => Project_Discussion_Room)
	@JoinTable({ name: 'project_discussion_room_employee' })
	project_discussion_rooms: Project_Discussion_Room[];

	@OneToMany(() => Project_discussion_reply, (project_discussion_reply)=> project_discussion_reply.employee)
	project_discussion_replies: Project_discussion_reply[]
	
	@ManyToMany(() => Event)
	@JoinTable({ name: 'event_employee' })
	events: Event[];

	@ManyToMany(() => Project)
	@JoinTable({ name: 'project_employee' })
	projects: Project[];

	@OneToMany(() => Discussion, (discussion) => discussion.employee)
	discussions: Discussion[]


	@OneToMany(() => Project, (Project) => Project.Added_by)
	Projects: Project[]

	@ManyToMany(() => Task)
	@JoinTable({ name: 'task_employee' })
	tasks: Task[];

	@Column({ default: 0 })
	token_version: number

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
