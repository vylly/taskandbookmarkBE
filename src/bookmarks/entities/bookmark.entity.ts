import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookmarks')
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  type: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  description: string;
}
