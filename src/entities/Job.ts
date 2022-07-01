import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "./Department";
import { Skill } from "./Skill";
import { Location } from "./Location";
import { Job_Type } from "./Job_Type";

import { Employee } from "./Employee";
import { Work_Experience } from "./Work_Experience";
import { Job_Application } from "./Job_Application";


export enum enumRate {
	PER_HOUR = 'Per Hour',
	PER_DAY = 'Per Day',
	PER_WEEK = 'Per Week',
    PER_MONTH = 'Per Month',
    PER_YEAR= 'Per Year',
}


@Entity()
export class Job extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
    
    @Column()
    title: string

    @Column({ type: 'date' })
	starts_on_date: Date

	@Column({ type: 'date' })
	ends_on_date: Date

    @ManyToMany(() => Skill)
    @JoinTable({ name: 'job_skill'})
    skills: Skill[]

    @ManyToMany(() => Location)
    @JoinTable({ name: 'job_location'})
    locations: Location[]

    @ManyToOne(() => Department, (department) => department.jobs, {
        onDelete:"SET NULL"
    })
    @JoinColumn()
    department: Department

    @OneToMany(() => Job_Application, (job_application) => job_application.jobs,{
        onDelete:'SET NULL'
    })
    job_application: Job_Application


    //status column has true = "open" & false = "close"
    @Column({nullable: true, default: false})
    status: boolean

    @Column()
    total_openings: number


    @ManyToOne(() => Job_Type, (job_type) => job_type.jobs, {
        onDelete:"SET NULL"
    })
    @JoinColumn()
    job_type: Job_Type

    @ManyToOne(() => Work_Experience, (work_experience) => work_experience.jobs, {
        onDelete:"SET NULL"
    })
    @JoinColumn()
    work_experience: Work_Experience

    @ManyToOne(() => Employee, (employee) => employee.jobs, {
        onDelete:"SET NULL"
    })
    @JoinColumn()
    recruiter: Employee

    @Column()
    starting_salary_amount: number


    @Column({nullable: true})
    job_description: string

    @Column({ type: 'enum', enum: enumRate, default: enumRate.PER_HOUR })
	rate!: string
}