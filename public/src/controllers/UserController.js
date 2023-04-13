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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const data_source_1 = require("../utils/data-source");
const User_1 = __importDefault(require("../entities/User"));
const Profile_1 = __importDefault(require("../entities/Profile"));
const Payment_1 = __importDefault(require("../entities/Payment"));
const Feedback_1 = __importDefault(require("../entities/Feedback"));
const s3 = new aws_sdk_1.default.S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIAWYB32RTBO4MER3VK',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ||
            'LXuDebvgsv0FlXSNewnLqNYJvPBOYA6hKcsL',
    },
});
function uploadFile(req, res, fileBuffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const contentType = 'image/jpeg';
        const filename = `image-${Date.now().toString()}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME || 'garotasbrasil',
            Key: filename,
            Body: fileBuffer,
            ContentType: contentType,
        };
        try {
            yield s3.upload(params).promise();
            return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
        }
        catch (error) {
            console.log(error);
            throw new Error('Error uploading file');
        }
    });
}
class UserController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, provider, contato, plan_level, rg, data_nascimento, cidade, estado, confirmation_video, } = req.body;
            const userExists = yield data_source_1.AppDataSource.getRepository(User_1.default).findOne({
                where: { email },
            });
            if (userExists) {
                return res.status(400).json({ error: 'User already exists' });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 8);
            const videoBuffer = Buffer.from(confirmation_video, 'base64');
            const videoUrl = yield uploadFile(req, res, videoBuffer);
            const user = new User_1.default();
            user.name = name;
            user.email = email;
            user.password = hashedPassword;
            user.provider = provider;
            user.contact = contato;
            user.plan_level = plan_level;
            user.rg = rg;
            user.data_nascimento = data_nascimento;
            user.cidade = cidade;
            user.estado = estado;
            user.confirmation_video = videoUrl;
            const profile = new Profile_1.default();
            profile.name = 'Digite o Nome do seu Perfil';
            profile.description = 'Sobre mim';
            profile.quotes = [];
            profile.services = [];
            profile.videos = [];
            profile.tags = [];
            profile.photos = [];
            profile.city = cidade;
            profile.state = estado;
            profile.user = user;
            const pagamento = new Payment_1.default();
            pagamento.receipt = '';
            pagamento.user = user;
            pagamento.plan_level = plan_level;
            const feedback = new Feedback_1.default();
            feedback.nome = '';
            feedback.mensagem = '';
            feedback.profile = profile;
            const [userSaved, profileSaved, pagamentoSaved, feedbackSaved] = yield Promise.all([
                data_source_1.AppDataSource.getRepository(User_1.default).save(user),
                data_source_1.AppDataSource.getRepository(Profile_1.default).save(profile),
                data_source_1.AppDataSource.getRepository(Payment_1.default).save(pagamento),
                data_source_1.AppDataSource.getRepository(Feedback_1.default).save(feedback),
            ]);
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
                    select: ['id', 'name', 'email', 'provider', 'plan_level'],
                    relations: ['profiles', 'payments'],
                });
                // Encerra a conexão após finalizar a operação
                return res.json(users);
            }
            catch (error) {
                console.error(error); // Imprime a mensagem de erro no console
                // Encerra a conexão se ocorrer algum erro
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = new UserController();
