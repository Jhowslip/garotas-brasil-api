import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import Profile from './Profile';

@Entity()
export default class Feedback {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  mensagem!: string;

  @Column()
  rank!: number;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  profile!: Profile;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
