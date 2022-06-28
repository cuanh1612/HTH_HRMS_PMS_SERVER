import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Job } from "./Job"

@Entity()
export class Work_Experience extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({unique: true})
    name: string

    @OneToMany(() => Job, (job) => job.job_type)
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