import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { Interview } from './Interview.entity'


@Entity()
export class Interview_file extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	public_id: string

	@Column()
	url: string

    @Column()
	name: string

    @ManyToOne(() => Interview, (interview) => interview.interview_files, {
		onDelete: 'CASCADE',
		eager: true,
        nullable: false
	})
	@JoinColumn()
	interview: Interview

	@CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}
