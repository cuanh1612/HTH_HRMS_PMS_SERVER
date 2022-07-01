import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "./Department";
import { Skill } from "./Skill";
import { Location } from "./Location";
import { Job_Type } from "./Job_Type";

import { Employee } from "./Employee";
import { Work_Experience } from "./Work_Experience";
import { Job_Application } from "./Job_Application";




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

    @OneToMany(() => Location, (location) => location.jobs, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    locations: Location[]

    @OneToMany(() => Department, (department) => department.jobs, {
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


    @OneToMany(() => Job_Type, (job_type) => job_type.jobs, {
        onDelete:"SET NULL"
    })
    @JoinColumn()
    job_type: Job_Type

    @OneToMany(() => Work_Experience, (work_experience) => work_experience.jobs, {
        onDelete:"SET NULL"
    })
    @JoinColumn()
    work_experience: Work_Experience

    @OneToMany(() => Employee, (employee) => employee.jobs, {
        onDelete:"SET NULL"
    })
    @JoinColumn()
    recruiter: Employee

    @Column()
    starting_salary_amount: number


    @Column({nullable: true})
    job_description: string







    




    
}