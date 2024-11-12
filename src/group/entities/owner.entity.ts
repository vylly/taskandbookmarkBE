import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userid: number;

  @Column()
  groupid: number;
}
