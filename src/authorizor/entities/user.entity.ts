import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class user {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  userId: string;

  @Column()
  userCode: string;
}
