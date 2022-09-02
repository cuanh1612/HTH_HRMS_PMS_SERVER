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
import { Hourly_rate_project } from './Hourly_rate_project'
import { Interview } from './Interview'
import { Job } from './Job'
import { Leave } from './Leave'
import { Notification } from './Notification'
import { Project } from './Project'
import { Project_discussion_reply } from './Project_Discussion_Reply'
import { Project_Discussion_Room } from './Project_Discussion_Room'
import { Project_file } from './Project_File'
import { Project_note } from './Project_Note'
import { Room } from './Room'
import { Salary } from './Salary'
import { Sticky_note } from './StickyNote'

import { Task } from './Task'
import { Time_log } from './Time_Log'

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

	@OneToMany(()=> Room, (room)=> room.empl_create)
	rooms: Room[]

	@OneToMany(() => Job, (job) => job.recruiter)
	jobs: Job            

	@OneToMany(()=> Project, (project)=> project.project_Admin)
	projects_management: Project[]

	@OneToMany(()=> Project_file, (project)=> project.assignBy)
	project_file: Project_file[]

	@OneToMany(()=> Sticky_note, (Sticky_note)=> Sticky_note.employee)
	stickyNotes: Sticky_note[]

	// @OneToMany(()=> TimeLog, (timelog)=> timelog.employee)
	// timelogs: TimeLog[]

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

	@OneToMany(()=> Task, (task)=> task.assignBy)
	tasksAssignBy: Task[]

	@OneToMany(() => Conversation_reply, (conversation_reply) => conversation_reply.user)
	conversation_replies: Conversation_reply[]

	@ManyToMany(() => Conversation)
	@JoinTable({ name: 'conversation_employee' })
	conversations: Conversation[];
	
	@ManyToMany(() => Project_note)
	@JoinTable({ name: 'project_note_employee' })
	project_notes: Project_note[]

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

	@OneToMany(() => Salary, (salary) => salary.employee)
	salaries: Salary[]

	@OneToMany(() => Project_Discussion_Room, (project_discussion_room) => project_discussion_room.assigner)
	project_discussion_rooms: Project_Discussion_Room[]

	@OneToMany(()=> Hourly_rate_project, hourly_rate_project=> hourly_rate_project.employee)
	hourly_rate_projects: Hourly_rate_project[]

	@OneToMany(() => Time_log, (time_log) => time_log.employee, {
		nullable: true,
	})
	time_logs: Time_log[]

	@ManyToMany(() => Room)
	@JoinTable({ name: 'room_employee' })
	meeting_rooms: Room[];

	@OneToMany(()=> Notification, (Notification)=> Notification.employee)
	notifications: Notification[]

	@ManyToMany(() => Interview, {onDelete: 'CASCADE' })
	@JoinTable({ name: 'interview_employee' })
	interviews: Interview[]

	@Column({ default: 0 })
	token_version: number

	@Column({type: "bool", default: false})
	root: boolean

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
