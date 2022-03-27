import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Avatar } from './Avatar'
import { Department } from './Department'
import { Designation } from './Designation'

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
export class Employee extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ unique: true })
	employeeId!: string

	@Column()
	name!: string

	@Column({ unique: true })
	email!: string

	@Column()
	password!: string

	@Column({ nullable: true })
	country: string

	@Column({ nullable: true })
	mobile: string

	@Column({ type: 'enum', enum: enumGender })
	gender: string

	@Column({ type: 'date' })
	joining_date!: string

	@Column({ type: 'date', nullable: true })
	date_of_birth: string

	@Column({ nullable: true })
	address: string

	@Column()
	can_login!: boolean

	@Column()
	can_receive_email!: boolean

	@Column()
	hourly_rate!: number

	@Column('text', { array: true, default: [] })
	skills: string[]

	@Column({ type: 'enum', enum: enumRole, default: enumRole.EMPLOYEE })
	role: string

	@OneToOne(() => Avatar, {
		cascade: true,
	})
	@JoinColumn()
	avatar: Avatar

	@ManyToOne(() => Designation, (designation) => designation.employees)
	@JoinColumn()
	designation: Designation

	@ManyToOne(() => Department, (department) => department.employees)
	@JoinColumn()
	department: Department

	@Column({ default: 0 })
	token_version: number

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
