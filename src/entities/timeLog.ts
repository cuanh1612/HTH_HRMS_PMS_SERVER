import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class timeLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    
    
}