import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./Project.entity";
import { Task } from "./Task.entity";


@Entity()
export class Status extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title: string

    @Column()
    index: number

    @ManyToOne(() => Project, (project) => project.status, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    project: Project

    @Column({nullable: true})
    color: string

    @OneToMany(() => Task, (task) => task.status,{
        onDelete: 'SET NULL',
        nullable: true
    })
    tasks: Task

    @Column({default: false})
    root: boolean
}