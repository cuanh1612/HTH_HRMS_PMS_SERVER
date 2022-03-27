import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity()
export class Designation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
