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
import { Project } from './Project.entity'

@Entity()
export class Project_file extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	public_id: string

	@Column()
	url: string

    @Column()
	name: string

    @ManyToOne(() => Employee, (employee) => employee.tasksAssignBy, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    assignBy: Employee

    @ManyToOne(() => Project, (project) => project.project_files, {
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn()
	project: Project

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
