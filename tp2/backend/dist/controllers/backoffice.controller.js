var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as services from '../services/backoffice.service.js';
import * as accountServices from '../services/account.service.js';
import * as profileServices from '../services/profile.service.js';
import { ObjectId } from 'mongodb';
function getDashboard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield services.getDashboard()
            .then((data) => {
            res.status(200).json(data);
        });
    });
}
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return accountServices.createAccount(req.body)
            .then(() => {
            res.status(201).json({ message: "Cuenta creada" });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function editUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers['auth-token'];
        const profileId = req.params.profileId;
        return profileServices.updateProfile(token, req.body.user, new ObjectId(profileId))
            .then(() => {
            res.status(200).json({ message: "Cuenta editada" });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileId = req.params.profileId;
        console.log(profileId);
        return profileServices.getProfile(new ObjectId(profileId))
            .then((profile) => {
            res.status(200).json(profile);
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileId = req.params.profileId;
        return profileServices.deactivateProfile(new ObjectId(profileId))
            .then(() => {
            res.status(200).json({ message: "Cuenta eliminada" });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
export { getDashboard, createUser, editUser, getUser, deleteUser };
