import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categoryingroup')
export class CategoryInGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryid: number;

  @Column()
  groupid: number;

  @Column({ type: 'text' })
  color: string;
}
