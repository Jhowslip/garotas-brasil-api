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
                const profiles = yield data_source_1.AppDataSource.createQueryBuilder(Profile_1.default, 'profile')
                    .leftJoinAndSelect('profile.user', 'user')
                    .getMany();
                return res.json(profiles);
            }
            catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield data_source_1.AppDataSource.createQueryBuilder(Profile_1.default, 'profile')
                    .leftJoinAndSelect('profile.user', 'user')
                    .where('profile.id = :id', { id: req.params.id })
                    .getOne();
                if (!profile) {
                    return res.status(404).json({ error: 'Profile not found' });
                }
                return res.json(profile);
            }
            catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = new ProfileController();
