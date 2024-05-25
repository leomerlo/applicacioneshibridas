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
import jwt from 'jsonwebtoken';
import * as profileSchema from '../schemas/profile.schema.js';
import { db, client } from './mongo.service.js';
import { ProfileType } from '../schemas/profile.schema.js';
const profilesColelction = db.collection('profiles');
function createProfile(profile, type) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        let schema = profileSchema.profile;
        if (type === ProfileType.doc) {
            schema = profileSchema.docProfile;
        }
        yield schema.validate(profile, { abortEarly: true, stripUnknown: true })
            .then((profile) => __awaiter(this, void 0, void 0, function* () {
            // Since we only have one profile for each user we'll check if the accountId already exists
            const profileExist = yield profilesColelction.findOne({ accountId: new ObjectId(profile.accountId) });
            if (profileExist) {
                throw new Error('El perfil que intentas crear ya existe.');
            }
            yield profilesColelction.insertOne(profile);
        }))
            .catch((err) => {
            console.log(err);
            throw new Error('Faltan datos para crear el perfil.');
        });
    });
}
function getProfile(profileId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const profile = yield profilesColelction.findOne({ _id: new ObjectId(profileId), 'status': { $exists: true } });
        const account = yield db.collection('accounts').findOne({ _id: new ObjectId(profile === null || profile === void 0 ? void 0 : profile.accountId) });
        if (!profile) {
            throw new Error('El perfil que intentas obtener no existe.');
        }
        profile.email = (account === null || account === void 0 ? void 0 : account.userName) || '';
        profile.accountType = profile.accountType || ProfileType.user;
        return profile;
    });
}
function getProfileByAccount(accountId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        return profilesColelction.findOne({ accountId: new ObjectId(accountId), 'status': { $exists: true } });
    });
}
function updateProfile(token_1, profile_1) {
    return __awaiter(this, arguments, void 0, function* (token, profile, profileId = null) {
        yield client.connect();
        const payload = jwt.verify(token, "7tm4puxhVbjf73X7j3vB");
        const updateId = profileId ? profileId : payload._id;
        if (profileId && payload.accountType !== ProfileType.admin) {
            throw new Error('No tienes permisos para modificar este perfil.');
        }
        const update = Object.assign({}, profile);
        if (!profileId) {
            update.accountId = new ObjectId(payload.accountId);
        }
        else {
            update.accountId = new ObjectId(profile.accountId);
        }
        if (payload.docId) {
            update.docId = new ObjectId(payload.docId);
        }
        const updated = yield profilesColelction.replaceOne({ _id: new ObjectId(updateId) }, update);
        if (updated.matchedCount == 0) {
            throw new Error('El perfil que intentas modificar no existe.');
        }
    });
}
function deactivateProfile(profileId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const updated = yield profilesColelction.updateOne({ _id: new ObjectId(profileId) }, { $set: { status: "inactive" } });
        if (updated.matchedCount == 0) {
            throw new Error('El perfil que intentas modificar no existe.');
        }
    });
}
export { createProfile, getProfile, updateProfile, getProfileByAccount, deactivateProfile };
