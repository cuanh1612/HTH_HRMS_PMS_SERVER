import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { Avatar } from './Avatar'
import { Client_Category } from './Client_Category'
import { Client_Sub_Category } from './Client_Sub_Category'
import { Contract } from './Contract'
import { Discussion } from './Discussion'
import { Event } from './Event'
import { Notification } from './Notification'
import { Project } from './Project'
import { Room } from './Room'

export enum enumSalutation {
	MR = 'Mr',
	MRS = 'Mrs',
	MISS = 'Miss',
	DR = 'Dr',
	SIR = 'Sir',
	MADAM = 'Madam',
}

export enum enumGender {
	MALE = 'Male',
	FEMAILE = 'Female',
	OTHER = 'Others',
}

export enum enumRole {
	CLIENT = 'Client',
}

@Entity()
export class Client extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ type: 'enum', enum: enumSalutation, nullable: true })
	salutation: string

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

	@Column({ type: 'enum', enum: enumGender, nullable: true })
	gender: string

	@Column()
	can_login!: boolean

	@Column()
	can_receive_email!: boolean

	@OneToOne(() => Avatar, {
		cascade: true,
		eager: true,
	})
	@JoinColumn()
	avatar: Avatar

	@Column({ nullable: true })
	company_name: string

	@Column({ nullable: true })
	official_website: string

	@Column({ nullable: true })
	gst_vat_number: string

	@Column({ nullable: true })
	office_phone_number: string

	@Column({ nullable: true })
	city: string

	@Column({ nullable: true })
	state: string

	@Column({ nullable: true })
	postal_code: string

	@Column({ nullable: true })
	company_address: string

	@Column({ nullable: true })
	shipping_address: string

	@Column({ nullable: true })
	note: string

	@Column({ type: 'enum', enum: enumRole, default: enumRole.CLIENT })
	role: string

	@Column({ default: 0 })
	token_version: number

	@ManyToOne(() => Client_Category, (client_category) => client_category.clients, {
		onDelete: 'SET NULL',
		eager: true,
		nullable: true,
	})
	@JoinColumn()
	client_category: Client_Category

	@ManyToOne(() => Client_Sub_Category, (client_sub_category) => client_sub_category.clients, {
		onDelete: 'SET NULL',
		eager: true,
		nullable: true,
	})
	@JoinColumn()
	client_sub_category: Client_Sub_Category

	@OneToMany(() => Project, (project) => project.client)
	@JoinColumn()
	projects: Project[]

	@OneToMany(() => Contract, (contract) => contract.client)
	contracts: Contract[]

	@ManyToMany(() => Event)
	@JoinTable({ name: 'event_client' })
	events: Event[]

	@OneToMany(() => Discussion, (discussion) => discussion.client)
	discussions: Discussion[]

	@ManyToMany(() => Room)
	@JoinTable({ name: 'room_client' })
	rooms: Room[]

	@OneToMany(()=> Notification, (Notification)=> Notification.client)
	notifications: Notification[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
