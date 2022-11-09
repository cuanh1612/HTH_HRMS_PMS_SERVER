import {
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    OneToMany,
    
} from "typeorm";
import { Task  } from "./Task.entity";


@Entity()
export class Task_Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string
    
    @OneToMany(() => Task, (task) => task.task_category,{
        onDelete: 'SET NULL'
    })
    tasks: Task[]

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt: Date

    @UpdateDateColumn({
        name: 'updated_at',
    })
    updatedAt: Date

}