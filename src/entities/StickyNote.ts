import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Employee } from "./Employee";

export enum enumColor {
    RED = '#FF0000',
    BLUE = '#0000FF',
    GRAY = '#808080',
    GREEN = '#008000',
    PURPLE = '#800080'
}


@Entity()
export class StickyNote extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
    

    @Column({type: 'enum', enum: enumColor, default: enumColor.BLUE})
    color: string

    @Column({nullable: true})
    note: string

    @ManyToOne(() => Employee, { onDelete: 'CASCADE'})
    @JoinTable({ name: 'employee'})
    employee: Employee

    @CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
    
}