import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Job } from "./Job"

@Entity()
export class Job_Type extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({unique: true})
    name: string

    @ManyToOne(() => Job, (job) => job.job_type, {
        onDelete:"SET NULL"
    })
    jobs: Job
    
    @CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date

   
}