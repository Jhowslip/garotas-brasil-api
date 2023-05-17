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
const Profile_1 = __importDefault(require("../entities/Profile"));
const data_source_1 = require("../utils/data-source");
class FeedBackController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedback = yield data_source_1.AppDataSource.createQueryBuilder(Feedback_1.default, 'feedback')
                    .leftJoinAndSelect('feedback.profile', 'profile')
                    .getMany();
                return res.json(feedback);
            }
            catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id; // pega o id da URL
                const feedback = yield data_source_1.AppDataSource.createQueryBuilder(Feedback_1.default, 'feedback')
                    .leftJoinAndSelect('feedback.profile', 'profile')
                    .where('feedback.id = :id', { id }) // adiciona uma cláusula "where" para buscar pelo id
                    .getOne(); // usa o método "getOne" para retornar apenas um registro
                if (!feedback) { // verifica se não encontrou nenhum registro
                    return res.status(404).json({ error: 'Feedback not found' });
                }
                return res.json(feedback);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    getByProfileId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profileId = req.params.id;
                const feedbacks = yield data_source_1.AppDataSource.createQueryBuilder(Feedback_1.default, 'feedback')
                    .where('feedback.profile = :profileId', { profileId }) // adiciona uma cláusula "where" para buscar pelos feedbacks do profile
                    .getMany(); // usa o método "getMany" para retornar vários registros
                return res.json(feedbacks);
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nome, mensagem, profile_id, rank } = req.body;
            const profile = yield data_source_1.AppDataSource.getRepository(Profile_1.default).findOne({
                where: { id: profile_id },
            });
            if (!profile) {
                return res.status(401).json({ error: 'Profile not found' });
            }
            const feedback = yield data_source_1.AppDataSource.getRepository(Feedback_1.default).save({
                nome: nome,
                mensagem: mensagem,
                rank: rank,
                profile: profile,
            });
            return res.json(feedback);
        });
    }
}
exports.default = new FeedBackController();
