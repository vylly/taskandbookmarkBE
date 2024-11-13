import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string;
}
