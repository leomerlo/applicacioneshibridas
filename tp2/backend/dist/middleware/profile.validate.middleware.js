var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ObjectId } from 'mongodb';
import * as profileSchema from '../schemas/profile.schema.js';
import * as profileService from '../services/profile.service.js';
import { ProfileType } from '../schemas/profile.schema.js';
function validateProfileData(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let userTypeSchema;
        const body = req.body.user ? req.body.user : req.body;
        if (req.body.accountType === 'doc') {
            userTypeSchema = profileSchema.docProfile;
        }
        else {
            userTypeSchema = profileSchema.profile;
        }
        return userTypeSchema.validate(body, { abortEarly: false, stripUnknown: true })
            .then((account) => {
            if (req.body.user) {
                req.body.user = account;
            }
            else {
                req.body = account;
            }
            next();
        })
            .catch((err) => {
            console.log(err);
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function validateDoctor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield profileService.getProfile(req.body.profileId)
            .then((profile) => {
            if (profile) {
                const docProfile = profile;
                if (docProfile.status === profileSchema.ProfileStatus.active && docProfile.idDocument) {
                    next();
                    return;
                }
            }
            throw new Error('No tenés los permisos correctos para realizar esta acción');
        })
            .catch((err) => {
            res.status(500).json({ error: { message: err.message } });
        });
    });
}
function validatePatient(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const patientId = req.params.patientId;
        const docId = req.body.profileId;
        yield profileService.getProfile(new ObjectId(patientId))
            .then((profile) => {
            var _a;
            if (profile) {
                if ((_a = profile.docId) === null || _a === void 0 ? void 0 : _a.equals(docId)) {
                    next();
                    return;
                }
            }
            throw new Error('No tenés los permisos correctos para realizar esta acción');
        })
            .catch((err) => {
            res.status(500).json({ error: { message: err.message } });
        });
    });
}
function validateAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield profileService.getProfileByAccount(new ObjectId(req.body.accountId))
            .then((profile) => {
            if (profile && profile.accountType === ProfileType.admin) {
                next();
                return;
            }
            console.log(req.body.accountId);
            throw new Error('No tenés los permisos correctos para realizar esta acción');
        })
            .catch((err) => {
            res.status(500).json({ error: { message: err.message } });
        });
    });
}
export { validateProfileData, validateDoctor, validatePatient, validateAdmin };
