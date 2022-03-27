import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Avatar } from './Avatar';
import { Department } from './Department';
import { Designation } from './Designation';

export enum enumGender {
  MALE = 'Male',
  FEMAILE = 'Female',
  OTHER = 'Others',
}

@Entity()
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  employeeId!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  country: string;

  @Column()
  mobile: string;

  @Column({ type: 'enum', enum: enumGender })
  gender: string;

  @Column({ type: 'date' })
  joining_date!: string;

  @Column({ type: 'date' })
  date_of_birth: string;

  @Column()
  address: string;

  @Column()
  can_login!: boolean;

  @Column()
  can_receive_email!: boolean;

  @Column()
  hourly_rate!: number;

  @Column('text', { array: true })
  skills: string[];

  @OneToOne(() => Avatar, {
    cascade: true,
  })
  @JoinColumn()
  avatar: Avatar;

  @OneToOne(() => Designation)
  @JoinColumn()
  designnation: Designation;

  @OneToOne(() => Department)
  @JoinColumn()
  department: Department;

  @Column({default: 0})
  token_version: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
