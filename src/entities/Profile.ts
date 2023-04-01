import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToOne,
    ManyToMany,
  } from 'typeorm';
  import User from './User';
  import Feedback from './Feedback';
  
  @Entity()
  export default class Profile {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    name!: string;
  
    @Column()
    description!: string;
  
    @Column('text', { array: true, nullable: true })
    quotes!: string[];
  
    @Column('text', { array: true, nullable: true })
    services!: string[];
  
    @Column('text', { array: true, nullable: true })
    tags!: string[];
  
    @Column('text', { array: true, nullable: true })
    photos!: string[];
  
    @Column()
    city!: string;
  
    @Column()
    state!: string;
  
    @Column('text', { array: true, nullable: true })
    videos!: string[];
  
    @ManyToOne(() => User, user => user.profiles)
    user!: User;
  
    @OneToMany(() => Feedback, feedback => feedback.profile)
    feedbacks!: Feedback[];
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }
  