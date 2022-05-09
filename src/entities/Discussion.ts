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
import { Contract } from './Contract'
import { Employee } from './Employee'

@Entity()
export class Discussion extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	content: string

	@ManyToOne(() => Employee, (employee) => employee.discussions, {
		onDelete: 'SET NULL',
		eager: true,
        nullable: true
	})
	@JoinColumn()
	employee: Employee

    @ManyToOne(() => Client, (client) => client.discussions, {
		onDelete: 'SET NULL',
		eager: true,
        nullable: true
	})
	@JoinColumn()
	client: Client

	@ManyToOne(() => Contract, (contract) => contract.discussions, {
		onDelete: 'SET NULL',
		eager: true,
	})
	@JoinColumn()
	contract: Contract

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
