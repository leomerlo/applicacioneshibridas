var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as services from '../services/account.service.js';
import * as tokenService from '../services/token.service.js';
import { ProfileType } from '../schemas/profile.schema.js';
function createAccount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const type = req.body.type;
        if (type === ProfileType.admin) {
            res.status(500).json({ error: { message: "No podés crear admins" } });
            return;
        }
        return services.createAccount(req.body)
            .then(() => {
            res.status(201).json({ message: "Cuenta creada" });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: [err.message] } });
        });
    });
}
function updateAccount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers['auth-token'];
        return services.updateAccount(token, req.body)
            .then(() => {
            res.status(201).json({ message: "Cuenta actualizada" });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function createSession(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return services.createSession(req.body)
            .then((profile) => __awaiter(this, void 0, void 0, function* () {
            return { token: yield tokenService.createToken(profile), profile };
        }))
            .then((token) => {
            res.status(200).json({ token });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function deleteSession(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers['auth-token'];
        return tokenService.deleteToken(token)
            .then(() => {
            res.status(200).json({ message: "Sesión cerrada" });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function forgotPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return services.forgotPassword(req.body.email)
            .then(() => {
            res.status(201).json({ message: "Se envio el email para reestablecer la contraseña." });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
export { createAccount, createSession, updateAccount, deleteSession, forgotPassword };
