import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Company_Info extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	name: string

	@Column()
	email: string

	@Column()
	phone: string

    @Column()
	website: string

	@Column({nullable: true})
	logo_name: string

	@Column({nullable: true})
	logo_public_id: string

	@Column({nullable: true})
	logo_url: string

	@Column({nullable: true})
	terms_and_condition_recruit: string

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
