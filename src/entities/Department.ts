import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Employee } from './Employee'

@Entity()
export class Department extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	name!: string

	@OneToMany(() => Employee, (Employee) => Employee.department)
	@JoinColumn()
	employees: Employee[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
