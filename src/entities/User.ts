import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';

import bcrypt from 'bcryptjs';
import Profile from './Profile';
import Payment from './Payment';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  provider!: boolean;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  @OneToMany(() => Profile, (profile) => profile.user)
  profiles!: Profile[];

  @Column('text', { array: true, nullable: true })
  rg_photos!: string[];

  @Column()
  confirmation_video!: string;

  @Column('text', { nullable: true })
  rg!: string;

  @Column('text', { nullable: true })
  cidade!: string;

  @Column('text', { nullable: true })
  estado!: string;

  @Column('text', { nullable: true })
  data_nascimento!: Date;

  @Column()
  contact!: string;

  @Column()
  plan_level!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
