import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class APIKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  appName: string;

  @Column()
  APIKey: string;

  @Column()
  redirectURI: string;

  @Column()
  host: string;
}
