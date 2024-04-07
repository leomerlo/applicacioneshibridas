var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import * as profileService from "../services/profile.service.js";
function updateProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers['auth-token'];
        profileService.updateProfile(token, req.body)
            .then(() => {
            res.status(201).json({ message: "Perfil actualizado" });
        })
            .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function getProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.headers['auth-token'];
        const tokenProfile = jwt.verify(token, "7tm4puxhVbjf73X7j3vB");
        if (tokenProfile._id) {
            profileService.getProfile(tokenProfile._id)
                .then((profile) => {
                console.log('obtained profile', profile);
                if (profile) {
                    profile.email = tokenProfile.email;
                    res.status(200).json(profile);
                }
            })
                .catch((err) => {
                res.status(400).json({ error: { message: err.message } });
            });
        }
    });
}
export { updateProfile, getProfile };
