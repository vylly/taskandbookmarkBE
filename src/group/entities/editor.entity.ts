import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('editors')
export class Editor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userid: number;

  @Column()
  groupid: number;
}
