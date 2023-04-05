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
const data_source_1 = require("../utils/data-source");
const Plan_1 = __importDefault(require("../entities/Plan"));
class SessionController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, price, level } = req.body;
            const plan = new Plan_1.default();
            plan.name = name;
            plan.description = description;
            plan.price = price;
            plan.level = level;
            const planSaved = yield data_source_1.AppDataSource.getRepository(Plan_1.default).save(plan);
            return res.json(planSaved);
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const plans = yield data_source_1.AppDataSource.getRepository(Plan_1.default).find();
                return res.json(plans);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = new SessionController();
