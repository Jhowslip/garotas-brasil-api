import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';
  import User from './User';
  
  @Entity()
  export default class Payment {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    receipt!: string;
  
    @ManyToOne(() => User, user => user.payments)
    user!: User;
  
    @Column()
    plan_level!: number;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }
  