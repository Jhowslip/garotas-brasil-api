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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const data_source_1 = require("../utils/data-source");
const User_1 = __importDefault(require("../entities/User"));
const Profile_1 = __importDefault(require("../entities/Profile"));
const Payment_1 = __importDefault(require("../entities/Payment"));
const Feedback_1 = __importDefault(require("../entities/Feedback"));
class UserController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nome, email, password, provider, confirmation_video, contato, nivel_plan, } = req.body;
            const userExists = yield data_source_1.AppDataSource.getRepository(User_1.default).findOne({
                where: { email },
            });
            if (userExists) {
                return res.status(400).json({ error: 'User already exists' });
            }
            function hashPassword(password) {
                return __awaiter(this, void 0, void 0, function* () {
                    let cripty = yield bcryptjs_1.default.hash(password, 8);
                    return cripty;
                });
            }
            const user = new User_1.default();
            user.name = nome;
            user.email = email;
            user.password = yield hashPassword(password);
            user.provider = provider;
            user.confirmation_video;
            user.contact = contato;
            user.plan_level = nivel_plan;
            const userSaved = yield data_source_1.AppDataSource.getRepository(User_1.default).save(user);
            const profile = new Profile_1.default();
            profile.name = 'Digite o Nome do seu Perfil';
            profile.description = 'Sobre mim';
            profile.quotes = [];
            profile.services = [];
            profile.videos = [];
            profile.tags = [];
            profile.photos = [];
            profile.city = '';
            profile.state = '';
            profile.user = userSaved;
            const profileSaved = data_source_1.AppDataSource.getRepository(Profile_1.default).save(profile);
            const pagamento = new Payment_1.default();
            pagamento.receipt = '';
            pagamento.user = userSaved;
            const pagamentoSaved = yield data_source_1.AppDataSource.getRepository(Payment_1.default).save(pagamento);
            const feedback = new Feedback_1.default();
            feedback.nome = '';
            feedback.mensagem = '';
            feedback.profile = profile;
            const feedbackSaved = yield data_source_1.AppDataSource.getRepository(Feedback_1.default).save(feedback);
            return res.json({
                id: userSaved.id,
                nome: userSaved.name,
                email: userSaved.email,
                provider: userSaved.provider,
                profile: profileSaved,
                pagamento: pagamentoSaved,
                feedback: feedbackSaved,
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, oldPassword } = req.body;
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const user = yield userRepository.findOne({ where: email });
            if (email === (user === null || user === void 0 ? void 0 : user.email)) {
                const userExists = yield userRepository.findOne({ where: { email } });
                if (userExists) {
                    return res.status(400).json({ error: 'User already exists.' });
                }
            }
            if (oldPassword && !(yield (user === null || user === void 0 ? void 0 : user.checkPassword(oldPassword)))) {
                return res.status(401).json({ error: 'Password does not match' });
            }
            userRepository.merge(user, req.body);
            const savedUser = yield userRepository.save(user);
            return res.json({
                id: savedUser.id,
                nome: savedUser.name,
                email: savedUser.email,
                provider: savedUser.provider,
            });
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield data_source_1.AppDataSource.getRepository(User_1.default).find({
                    select: ['id', 'name', 'email', 'provider'],
                    relations: ['profile', 'plan', 'pagamento'],
                });
                // Encerra a conexão após finalizar a operação
                return res.json(users);
            }
            catch (error) {
                // Encerra a conexão se ocorrer algum erro
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = new UserController();
