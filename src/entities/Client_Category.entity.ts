import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { Client } from './Client.entity'
import { Client_Sub_Category } from './Client_Sub_Category.entity'

@Entity()
export class Client_Category extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	name!: string

	@OneToMany(() => Client, (client) => client.client_category)
	clients: Client[]

	@OneToMany(() => Client_Sub_Category, (client_sub_category) => client_sub_category.client_category)
	client_sub_category: Client_Sub_Category[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
