import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class application {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  u_idx: number;

  @Column()
  name: string;

  @Column()
  APIKey: string;

  @Column()
  host: string;

  @Column()
  redirectURI: string;
}
