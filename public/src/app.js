"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const data_source_1 = require("./utils/data-source");
data_source_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    // VALIDATE ENV
    (0, validateEnv_1.default)();
    const app = (0, express_1.default)();
    // MIDDLEWARE
    // 1. Body parser
    app.use(express_1.default.json({ limit: '30mb' }));
    app.use((0, helmet_1.default)());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)());
    app.use('/api', routes_1.default);
    // 2. Logger
    // 3. Cookie Parser
    // 4. Cors
    // ROUTES
    // HEALTH CHECKER
    // UNHANDLED ROUTE
    // GLOBAL ERROR HANDLER
    const port = config_1.default.get('port');
    app.listen(port);
    console.log(`Server started on port: ${port}`);
}))
    .catch((error) => console.log(error));
