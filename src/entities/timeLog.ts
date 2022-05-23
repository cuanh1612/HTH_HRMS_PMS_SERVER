import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class timeLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    
}