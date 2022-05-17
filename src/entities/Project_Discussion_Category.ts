import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { Project_Discussion_Room } from './Project_Discussion_Room'

@Entity()
export class Project_discussion_category extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	name!: string

	@OneToMany(() => Project_Discussion_Room, (project_discussion_room) => project_discussion_room.project_discussion_category)
	project_discussion_rooms: Project_Discussion_Room[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
