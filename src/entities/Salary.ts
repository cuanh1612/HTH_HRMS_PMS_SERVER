import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { Employee } from './Employee'

export enum enumTypeSalary {
	INCREMENT = 'Increment',
	DECREMENT = 'Decrement',
}

@Entity()
export class Salary extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	amount: number

	@Column({ type: 'date' })
	date: Date

	@ManyToOne(() => Employee, (Employee) => Employee.salaries, {
		onDelete: 'CASCADE',
        eager: true
	})
	@JoinColumn()
	employee: Employee

    @Column({ type: 'enum', enum: enumTypeSalary, default: enumTypeSalary.INCREMENT })
	type: string

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
