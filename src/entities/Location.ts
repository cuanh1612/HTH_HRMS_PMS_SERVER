import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Job } from "./Job";
import { Job_Application } from "./Job_Application";




@Entity()
export class Location extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({unique: true})
    name: string

    @OneToMany(() => Job, (job) => job.locations,{
      onDelete: 'SET NULL'
    })
    jobs: Job

    @OneToMany(() => Job_Application, (job_application) => job_application.location,{
      onDelete: 'SET NULL'
    })
    job_application: Job_Application
    

    @CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date

   
}