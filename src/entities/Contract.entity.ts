import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { Client } from './Client.entity'
import { Company_logo } from './Company_Logo.entity'
import { Contract_file } from './Contract_File.entity'
import { Contract_type } from './Contract_Type.entity'
import { Discussion } from './Discussion.entity'
import { Sign } from './Sign.entity'

export enum enumCurrency {
	USD = 'USD',
	GBP = 'GBP',
	EUR = 'EUR',
	INR = 'INR',
	VND = 'VND',
}

@Entity()
export class Contract extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	subject!: string

	@Column({ nullable: true })
	description: string

	@Column({ type: 'date' })
	start_date!: Date

	@Column({ type: 'date', nullable: true })
	end_date: Date

	@Column()
	contract_value!: number

    @Column({ type: 'enum', enum: enumCurrency, default: enumCurrency.USD })
	currency: string

    @ManyToOne(() => Client, (client) => client.contracts, {
		onDelete: 'CASCADE',
		eager: true,
	})
	@JoinColumn()
	client: Client

    @Column({nullable: true})
    cell: string

    @Column({nullable: true})
    office_phone_number: string

    @Column({nullable: true})
    city: string

    @Column({nullable: true})
    state: string

    @Column({nullable: true})
    country: string

    @Column({nullable: true})
    postal_code: string

    @Column({nullable: true})
    alternate_address: string

    @Column({nullable: true})
    notes: string

    @OneToOne(() => Company_logo, {
		cascade: true,
		eager: true,
	})
	@JoinColumn()
	company_logo: Company_logo

    @OneToOne(() => Sign, {
		cascade: true,
		eager: true,
		nullable: true
	})
	@JoinColumn()
	sign: Sign

	@ManyToOne(() => Contract_type, (Contract_type) => Contract_type.contracts, {
		onDelete: 'SET NULL',
		eager: true,
		nullable: true,
	})
	@JoinColumn()
	contract_type: Contract_type

	@OneToMany(() => Discussion, (discussion) => discussion.employee)
	discussions: Discussion[]

	@OneToMany(() => Contract_file, (contract_file) => contract_file.contract)
	@JoinColumn()
	contract_files: Contract_file[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
