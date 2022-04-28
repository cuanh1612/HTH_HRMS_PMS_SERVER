import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, JoinTable,
    ManyToMany, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { Client } from './Client'
import { Employee } from './Employee'

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

	@Column()
	starts_on_time: string

	@Column({ type: 'date' })
	Ends_on_date: Date

	@Column()
	Ends_on_time: string

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
