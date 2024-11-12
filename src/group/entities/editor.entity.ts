import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('editors')
export class Editor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'number' })
  userid: number;

  @Column({ type: 'number' })
  groupid: number;
}
