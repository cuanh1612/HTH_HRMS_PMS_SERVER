import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./Project";
import { Task } from "./Task";


@Entity()
export class Milestone extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({unique: true})
    title: String

    @Column('float', {nullable: true})
    cost: number

    @Column({default:false})
    addtobudget:boolean

    @Column({default: false})
    status: boolean

    @Column({nullable: true})
    summary: String

    @ManyToOne(() => Project, (project) => project.milestones,{
        nullable: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    project: Project

    @OneToMany(() => Task, (task) => task.milestone,{
        nullable: true,
        onDelete: 'CASCADE'
    })
    tasks: Task[]
}