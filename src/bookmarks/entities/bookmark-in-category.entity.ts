import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookmarkincategory')
export class BookmarkInCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookmarkid: number;

  @Column()
  categoryid: number;
}
