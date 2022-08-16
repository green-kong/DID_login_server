import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Login {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  hash: string;

  @Column()
  refreshToken: string;
}
