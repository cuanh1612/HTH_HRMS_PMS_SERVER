import {
	BaseEntity,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Conversation_reply } from './ConversationReply'
import { Employee } from './Employee'

@Entity()
export class Conversation extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@ManyToMany(() => Employee, { eager: true, onDelete: 'CASCADE' })
	@JoinTable({ name: 'conversation_employee' })
	employees: Employee[]

	@OneToMany(() => Conversation_reply, (conversation_reply) => conversation_reply.user)
	conversation_replies: Conversation_reply[]

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
