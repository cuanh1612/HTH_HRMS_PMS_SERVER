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
import { Client } from './Client'
import { Employee } from './Employee'

@Entity()
export class Room extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	title!: string

    @Column()
	description: string

	@Column('time')
	start_time!: string
    
	@Column('date')
	date!: Date

	@ManyToOne(() => Employee, (employee) => employee.rooms, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	empl_create: Employee

    @ManyToMany(() => Employee)
	@JoinTable({ name: 'room_employee' })
	employees: Employee[];

	@ManyToMany(() => Employee)
	@JoinTable({ name: 'room_client' })
	clients: Client[];

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
