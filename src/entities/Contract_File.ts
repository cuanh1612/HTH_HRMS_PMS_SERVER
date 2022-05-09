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
import { Contract } from './Contract'

@Entity()
export class Contract_file extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	public_id: string

	@Column()
	url: string

    @Column()
	name: string

    @ManyToOne(() => Contract, (contract) => contract.contract_files, {
		onDelete: 'CASCADE',
		eager: true,
        nullable: false
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
