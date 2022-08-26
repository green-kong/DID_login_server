import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class connected {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  u_idx: number;

  @Column()
  a_idx: number;
}
