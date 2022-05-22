import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./Task";


@Entity()
export class Milestone extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({unique: true})
    title: String

    @Column({nullable: true})
    cost: number

    @Column({default:false})
    addtobudget:boolean

    @Column({default: false})
    status: boolean

    @Column({nullable: true})
    summary: String

    @OneToMany(() => Task, (task) => task.milestone,{
        nullable: true,
        onDelete: 'CASCADE'
    })
    tasks: Task[]
}