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
import { Job_Application } from './Job_Application'


@Entity()
export class Job_application_file extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	public_id: string

	@Column()
	url: string

    @Column()
	name: string

    @ManyToOne(() => Job_Application, (Job_Application) => Job_Application.job_application_files, {
		onDelete: 'CASCADE',
		eager: true,
        nullable: false
	})
	@JoinColumn()
	job_application: Job_Application

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
