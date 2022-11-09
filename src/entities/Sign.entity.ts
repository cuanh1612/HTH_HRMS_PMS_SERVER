import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Sign extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	first_name: string

	@Column()
	last_name: string

	@Column()
	email: string

	@Column()
	public_id: string

	@Column()
	url: string

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
