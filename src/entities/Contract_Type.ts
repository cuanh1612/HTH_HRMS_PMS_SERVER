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
import { Contract } from './Contract'

@Entity()
export class Contract_type extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column({unique: true})
	name!: string

	@OneToMany(() => Contract, (contract) => contract.contract_type)
	@JoinColumn()
	contracts: Contract[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
