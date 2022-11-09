import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Employee } from './Employee.entity'
import { Project } from './Project.entity'

export enum enumNoteType {
	PUBLIC = 'Public',
	PRIVATE = 'Private',
}

@Entity()
export class Project_note extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	title: string

	@Column({ type: 'enum', enum: enumNoteType, default: enumNoteType.PUBLIC })
	note_type: string

	@Column({type: "boolean", default: false})
	visible_to_client: boolean

	@Column({type: "boolean", default: false})
	ask_re_password: boolean

	@Column({nullable: true})
	detail: string

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@ManyToMany(() => Employee, { eager: true, onDelete: 'CASCADE', nullable: true })
	@JoinTable({ name: 'project_note_employee' })
	employees: Employee[]

	@ManyToOne(() => Project, (project) => project.project_notes, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	project: Project

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
