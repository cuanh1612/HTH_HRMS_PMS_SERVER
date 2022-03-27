import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, OneToMany, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { Employee } from './Employee';

@Entity()
export class Designation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => Employee, (Employee) => Employee.department)
  employees: Employee[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
