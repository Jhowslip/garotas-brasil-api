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
const Feedback_1 = __importDefault(require("../entities/Feedback"));
const data_source_1 = require("../utils/data-source");
class FeedBackController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nome, mensagem, profile_id } = req.body;
            const feedback = yield data_source_1.AppDataSource.getRepository(Feedback_1.default).save({
                nome: nome,
                mensagem: mensagem,
                profile: profile_id,
            });
            if (!feedback) {
                return res.status(401).json({ error: 'User not found' });
            }
            return res.json(feedback);
        });
    }
}
exports.default = new FeedBackController();
