var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as tokenService from '../services/token.service.js';
function validateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers['auth-token'];
        if (!token) {
            return res.status(401).json({ error: { message: 'No se ha enviado el token' } });
        }
        const account = yield tokenService.validateToken(token);
        if (!account) {
            return res.status(401).json({ error: { message: 'Token inválido' } });
        }
        next();
    });
}
function addProfileIdToBody(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers['auth-token'];
        const account = yield tokenService.validateToken(token);
        if (!account) {
            return res.status(401).json({ error: { message: 'Token inválido' } });
        }
        req.body.profileId = account._id;
        next();
    });
}
function addAccountIdToBody(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers['auth-token'];
        const account = yield tokenService.validateToken(token);
        if (!account) {
            return res.status(401).json({ error: { message: 'Token inválido' } });
        }
        req.body.accountId = account.accountId;
        next();
    });
}
export { validateToken, addProfileIdToBody, addAccountIdToBody };
