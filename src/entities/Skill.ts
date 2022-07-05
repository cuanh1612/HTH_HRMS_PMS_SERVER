import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Job } from './Job'
import { Job_Application } from './Job_Application'

@Entity()
export class Skill extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ unique: true })
	name: string

	@ManyToMany(() => Job)
	@JoinTable({ name: 'job_skill' })
	jobs: Job[]

  @ManyToMany(() => Job_Application, { onDelete: 'CASCADE', nullable: true })
	@JoinTable({ name: 'job_application_skill' })
	job_applications: Job_Application[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
