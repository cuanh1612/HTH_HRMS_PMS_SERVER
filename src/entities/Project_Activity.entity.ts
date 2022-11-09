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
import { Project } from './Project.entity'


@Entity()
export class Project_Activity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	content: string

    @Column()
	time: string
    
    @ManyToOne(() => Project, (project) => project.project_activities, {
		onDelete: 'CASCADE',
        nullable: true
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
