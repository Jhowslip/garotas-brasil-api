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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("./../../config/auth"));
const data_source_1 = require("../utils/data-source");
const User_1 = __importDefault(require("../entities/User"));
class SessionController {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield data_source_1.AppDataSource.getRepository(User_1.default).findOne({
                relations: ["profiles"],
                where: { email },
            });
            if (!user) {
                return res.status(401).json({ error: "User not found" });
            }
            if (!(yield user.checkPassword(password))) {
                return res.status(401).json({ error: "password invalid" });
            }
            const { id, name, contact, profiles } = user;
            return res.json({
                user: {
                    id,
                    name,
                    email,
                    contact,
                    profile: profiles[0],
                },
                token: jsonwebtoken_1.default.sign({ id }, auth_1.default.secret, {
                    expiresIn: auth_1.default.expiresIn,
                }),
            });
        });
    }
}
exports.default = new SessionController();
