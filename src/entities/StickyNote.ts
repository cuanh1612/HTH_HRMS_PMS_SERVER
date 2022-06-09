import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Client } from "./Client";
import { Employee } from "./Employee";

export enum enumColor {
    RED = '#FF0000',
    BLUE = '#0000FF',
    GRAY = '#808080',
    GREEN = '#008000',
    PURPLE = '#800080'
}


@Entity()
export class Sticky_note extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number
    

    @Column({type: 'enum', enum: enumColor, default: enumColor.BLUE})
    color: string

    @Column({nullable: true})
    note: string

    @ManyToOne(() => Employee, { onDelete: 'CASCADE'})
    @JoinTable({ name: 'employee'})
    employee: Employee

    @ManyToOne(() => Client, { onDelete: "CASCADE", nullable: true})
    @JoinTable({ name: 'client'})
    client: Client

    @CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
    
}