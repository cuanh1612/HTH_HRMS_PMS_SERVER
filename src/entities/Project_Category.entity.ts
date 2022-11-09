import {
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    OneToMany,
    
} from "typeorm";
import { Project } from "./Project.entity";


@Entity()
export class Project_Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string
    
    @OneToMany(() => Project, (project) => project.project_category,{
        onDelete: 'SET NULL'
        
    })
    projects: Project[]

    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt: Date

    @UpdateDateColumn({
        name: 'updated_at',
    })
    updatedAt: Date

}