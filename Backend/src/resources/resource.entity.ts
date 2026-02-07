import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  author: string;

  @Column()
  genre: string;

  @Column()
  publishedYear: number;

  @Column({ default: true })
  available: boolean;
}
