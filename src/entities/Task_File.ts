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
import { Task } from './Task'


@Entity()
export class Task_file extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	public_id: string

	@Column()
	url: string

    @Column()
	name: string

    @ManyToOne(() => Task, (task) => task.task_files, {
		onDelete: 'CASCADE',
		eager: true,
        nullable: false
	})
	@JoinColumn()
	task: Task

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
