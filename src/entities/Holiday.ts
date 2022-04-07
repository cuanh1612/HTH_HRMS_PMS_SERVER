import { 
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn, } from "typeorm";

@Entity()
export class Holiday extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'date'})
    holiday_date: Date

    @Column()
    occasion!: string

    @CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
}

