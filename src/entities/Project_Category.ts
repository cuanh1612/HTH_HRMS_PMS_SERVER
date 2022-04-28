import {
    BaseEntity,
    Column,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    
} from "typeorm";
import { Project } from "./Project";


@Entity()
export class Project_Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string
    
    @OneToMany(() => Project, (project) => project.project_category,{
        onDelete: 'SET NULL'
        
    })
    @JoinColumn()
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