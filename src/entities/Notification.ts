import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Client } from './Client'
import { Employee } from './Employee'


@Entity()
export class Notification extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	content: string

    @Column()
	url: string
    
    @ManyToOne(() => Employee, (Employee) => Employee.notifications, {
		onDelete: 'CASCADE',
        nullable: true
	})
	@JoinColumn()
	employee: Employee

    @ManyToOne(() => Client, (Client) => Client.notifications, {
		onDelete: 'CASCADE',
        nullable: true
	})
	@JoinColumn()
	client: Client

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
