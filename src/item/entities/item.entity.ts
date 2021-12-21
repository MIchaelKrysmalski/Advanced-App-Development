import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  cost: number;
}
