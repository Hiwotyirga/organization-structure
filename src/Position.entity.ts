import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Employee } from './Employee.entity';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Position, (position) => position.subordinates, { nullable: true })
  reportingTo: Position;

  @OneToMany(() => Position, (position) => position.reportingTo)
  subordinates: Position[];

  @OneToMany(() => Employee, (employee) => employee.position)
  employees: Employee[];
}