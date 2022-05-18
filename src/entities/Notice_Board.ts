import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

export enum enumNoticeTo {
	CLIENTS = 'Clients',
	EMPLOYEES = 'Employees',
}

@Entity()
export class Notice_board extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({ type: 'enum', enum: enumNoticeTo, default: enumNoticeTo.CLIENTS })
	notice_to: string

	@Column()
	heading: string

	@Column()
	details: string

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
