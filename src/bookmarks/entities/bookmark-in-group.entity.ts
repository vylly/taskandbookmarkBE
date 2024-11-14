import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bookmarkingroup')
export class BookmarkInGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookmarkid: number;

  @Column()
  groupid: number;
}
