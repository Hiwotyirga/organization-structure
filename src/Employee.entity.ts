import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Position } from './Position.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @ManyToOne(() => Position, (position) => position.employees)
  position: Position;
}