import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Jobs extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
    
    @Column()
    title: string

    @Column({ type: 'date' })
	starts_on_date: Date

	@Column({ type: 'date' })
	ends_on_date: Date

    
}