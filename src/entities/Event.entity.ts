import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity, JoinTable,
	ManyToMany, PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { Client } from './Client.entity'
import { Employee } from './Employee.entity'

@Entity()
export class Event extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	name: string

	@Column()
	color: string

	@Column()
	where: string

	@Column({ nullable: true })
	description: string

	@Column({ type: 'date' })
	starts_on_date: Date

	@Column({ type: 'date' })
	ends_on_date: Date

	@Column({type: "time"})
	starts_on_time: string

	@Column({type: "time"})
	ends_on_time: string

	@ManyToMany(() => Employee, { eager: true, onDelete: 'CASCADE' })
	@JoinTable({ name: 'event_employee' })
	employees: Employee[]

	@ManyToMany(() => Client, { eager: true, onDelete: 'CASCADE' })
	@JoinTable({ name: 'event_client' })
	clients: Client[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
