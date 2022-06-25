<<<<<<< HEAD
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Job } from "./Job";
=======
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
>>>>>>> c29c7ebe1bef3c5cb800ac7aa8c911e5dacf39f3



@Entity()
export class Skill extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({unique: true})
    name: string

<<<<<<< HEAD
    @ManyToMany(() => Job)
    jobs: Job[]

    

=======
>>>>>>> c29c7ebe1bef3c5cb800ac7aa8c911e5dacf39f3
    @CreateDateColumn({
		name: 'created_at',
	})
	createdAt: Date

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date
<<<<<<< HEAD

   
=======
>>>>>>> c29c7ebe1bef3c5cb800ac7aa8c911e5dacf39f3
}