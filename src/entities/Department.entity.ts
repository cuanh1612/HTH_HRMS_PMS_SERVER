
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn, OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { Employee } from './Employee.entity'
import { Job } from './Job.entity'
import { Project } from './Project.entity'

@Entity()
export class Department extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	name!: string

	@OneToMany(() => Employee, (Employee) => Employee.department)
	@JoinColumn()
	employees: Employee[]

	@OneToMany(() => Project, (project) => project.department)
	@JoinColumn()
	projects: Project[]

	@OneToMany(() => Job, (job) => job.department)
	jobs: Job[]

	

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}

