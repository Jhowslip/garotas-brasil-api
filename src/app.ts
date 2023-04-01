require('dotenv').config();
import express, { Response } from 'express';
import config from 'config';
import validateEnv from './utils/validateEnv';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { AppDataSource } from './utils/data-source';

AppDataSource.initialize()
  .then(async () => {
    // VALIDATE ENV
    validateEnv();

    const app = express();

    // MIDDLEWARE

    // 1. Body parser
    app.use(express.json({ limit: '30mb' }));
    app.use(helmet());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use('/api', routes);

    // 2. Logger

    // 3. Cookie Parser

    // 4. Cors

    // ROUTES

    // HEALTH CHECKER

    // UNHANDLED ROUTE

    // GLOBAL ERROR HANDLER

    const port = config.get<number>('port');
    app.listen(port);

    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => console.log(error));
