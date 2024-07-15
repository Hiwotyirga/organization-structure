import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  reportingToId: number;

  @ManyToOne(() => Position, (position) => position.subordinates, {
    nullable: true,
  })
  @JoinColumn({ name: 'reportingToId' })
  reportingTo: Position;

  @OneToMany(() => Position, (position) => position.reportingTo)
  subordinates: Position[];
}
