import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Client } from './Client'
import { Client_Category } from './Client_Category'

@Entity()
export class Client_Sub_Category extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	name!: string

	@ManyToOne(() => Client_Category, (client_category) => client_category.clients, {
        onDelete: "CASCADE",
		eager: true,
	})
	@JoinColumn()
	client_category: Client_Category

    @OneToMany(() => Client, (client) => client.client_category)
	clients: Client[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
