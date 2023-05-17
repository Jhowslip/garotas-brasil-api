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
const Profile_1 = __importDefault(require("../entities/Profile"));
class ProfileController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const planLevel = req.query.plan_level; // obtém o valor do parâmetro de consulta
                const city = req.query.city; // obtém o valor do parâmetro de consulta
                const state = req.query.state; // obtém o valor do parâmetro de consulta
                const profiles = yield data_source_1.AppDataSource.getRepository(Profile_1.default).find({
                    where: {
                        user: {
                            provider: true,
                            plan_level: planLevel === null || planLevel === void 0 ? void 0 : planLevel.toString(),
                            cidade: city === null || city === void 0 ? void 0 : city.toString(),
                            estado: state === null || state === void 0 ? void 0 : state.toString(),
                        }, // filtra os perfis com base no valor do parâmetro de consulta
                    },
                });
                // Encerra a conexão após finalizar a operação
                return res.json(profiles);
            }
            catch (error) {
                console.error(error); // Imprime a mensagem de erro no console
                // Encerra a conexão se ocorrer algum erro
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    getById(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const profile = yield data_source_1.AppDataSource.getRepository(Profile_1.default).findOne({
                    relations: ["user"],
                    where: { id: id },
                });
                if (!profile) {
                    return res.status(404).json({ error: "Profile not found" });
                }
                const response = {
                    id: profile === null || profile === void 0 ? void 0 : profile.id,
                    name: profile === null || profile === void 0 ? void 0 : profile.name,
                    description: profile === null || profile === void 0 ? void 0 : profile.description,
                    quotes: profile === null || profile === void 0 ? void 0 : profile.quotes,
                    services: profile === null || profile === void 0 ? void 0 : profile.services,
                    tags: profile === null || profile === void 0 ? void 0 : profile.tags,
                    photos: profile === null || profile === void 0 ? void 0 : profile.photos,
                    city: profile === null || profile === void 0 ? void 0 : profile.city,
                    state: profile === null || profile === void 0 ? void 0 : profile.state,
                    videos: profile === null || profile === void 0 ? void 0 : profile.videos,
                    contact: (_a = profile === null || profile === void 0 ? void 0 : profile.user) === null || _a === void 0 ? void 0 : _a.contact,
                    plan_level: (_b = profile === null || profile === void 0 ? void 0 : profile.user) === null || _b === void 0 ? void 0 : _b.plan_level,
                    created_at: profile === null || profile === void 0 ? void 0 : profile.created_at,
                    updated_at: profile === null || profile === void 0 ? void 0 : profile.updated_at,
                };
                return res.json(response);
            }
            catch (error) {
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    update(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { city, description, id, name, photos, quotes, services, state, tags, videos, } = req.body;
            try {
                const profile = yield data_source_1.AppDataSource.getRepository(Profile_1.default).findOne({
                    where: { id: (_a = req.body) === null || _a === void 0 ? void 0 : _a.id },
                });
                if (!profile) {
                    return res.status(404).json({ error: "Profile not found" });
                }
                const profileUpdated = yield data_source_1.AppDataSource.getRepository(Profile_1.default).merge(profile, {
                    city,
                    description,
                    id,
                    name,
                    photos,
                    quotes,
                    services,
                    state,
                    tags,
                    videos,
                });
                const profileSaved = yield data_source_1.AppDataSource.getRepository(Profile_1.default).save(profileUpdated);
                return res.json(profileSaved);
            }
            catch (error) {
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    }
}
exports.default = new ProfileController();
