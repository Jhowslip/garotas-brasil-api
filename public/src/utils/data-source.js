"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require('dotenv').config();
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("../entities/User"));
const Profile_1 = __importDefault(require("../entities/Profile"));
const Plan_1 = __importDefault(require("../entities/Plan"));
const Payment_1 = __importDefault(require("../entities/Payment"));
const Feedback_1 = __importDefault(require("../entities/Feedback"));
// const postgresConfig = config.get<{
//   host: string;
//   port: number;
//   username: string;
//   password: string;
//   database: string;
// }>('postgresConfig');
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'db.yioyjdglktnmrssxdyuy.supabase.co',
    port: 5432,
    username: 'postgres',
    password: 'dGHg4eVwTaStJHT5',
    database: 'postgres',
    synchronize: false,
    logging: false,
    entities: [User_1.default, Profile_1.default, Plan_1.default, Payment_1.default, Feedback_1.default],
    migrations: ['src/migrations/**/*{.ts,.js}'],
    subscribers: ['src/subscribers/**/*{.ts,.js}'],
});
