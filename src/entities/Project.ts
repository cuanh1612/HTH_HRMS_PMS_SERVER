import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";
import { Department } from "./Department";
import { Employee } from "./Employee";
import { Project_Category } from "./Project_Category";



export enum enumCurrency {
    USD = 'USD',
    GBP = 'GBP',
    EUR = 'EUR',
    INR = 'INR',
    VND = 'VND',
}

@Entity()
export class Project extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column({ type: 'date' })
    start_date!: Date

    @Column({ type: 'date' })
    Deadline: Date

    @Column()
    project_summary: string

    @Column()
    notes: string

    @Column({ nullable: true })
    project_budget: number

    @Column({ nullable: true })
    hours_estimate: number

    @Column({ type: 'boolean', default: false })
    send_task_noti: boolean

    @ManyToOne(() => Project_Category, (project_Category) => project_Category.projects, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    project_category: Project_Category

    @ManyToOne(() => Department, (department) => department.projects, {
        onDelete: 'SET NULL'
    })
    @JoinColumn()
    department: Department

    @ManyToOne(() => Client, (client) => client.projects, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    client: Client

    @ManyToMany(() => Employee, {onDelete: 'CASCADE'})
	@JoinTable({ name: 'project_employee'})
	employees: Employee[]


    @Column({ type: 'enum', enum: enumCurrency, default: enumCurrency.USD })
    currency: string





}