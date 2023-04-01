require('dotenv').config();
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';
import User from '../entities/User';
import Profile from '../entities/Profile';
import Plan from '../entities/Plan';
import Payment from '../entities/Payment';
import Feedback from '../entities/Feedback';

const postgresConfig = config.get<{
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}>('postgresConfig');

export const AppDataSource = new DataSource({
  ...postgresConfig,
  type: 'postgres',
  synchronize: false,
  logging: false,
  entities: [User,Profile,Plan,Payment,Feedback],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  subscribers: ['src/subscribers/**/*{.ts,.js}'],
});
