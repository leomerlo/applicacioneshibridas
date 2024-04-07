var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import * as profileService from './profile.service.js';
import { ProfileType, ProfileStatus } from '../schemas/profile.schema.js';
import { db, client } from './mongo.service.js';
import * as tokenService from './token.service.js';
import transporter from './email.service.js';
import generator from 'generate-password';
const accountsCollection = db.collection('accounts');
function createAccount(account) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        if (!account.type) {
            throw new Error('Falta el tipo de cuenta.');
        }
        // For now we only allow for one profile per user
        const accountExist = yield accountsCollection.findOne({ userName: account.userName });
        if (accountExist) {
            throw new Error('La cuenta que intentas crear ya existe.');
        }
        const newAccount = {
            userName: account.userName,
            password: account.password,
        };
        const salt = yield bcrypt.genSalt(10);
        newAccount.password = yield bcrypt.hash(account.password, salt);
        const createdAccount = yield accountsCollection.insertOne(newAccount);
        try {
            const newProfile = {
                accountId: new ObjectId(createdAccount.insertedId),
                name: account.userName,
                status: ProfileStatus.inactive,
                accountType: account.type,
            };
            if (account.docId) {
                newProfile.docId = account.docId;
            }
            if (account.type == ProfileType.doc) {
                const docAccount = account;
                const docProfile = newProfile;
                docProfile.accountId = new ObjectId(newProfile.accountId);
                docProfile.status = ProfileStatus.pending;
                docProfile.idDocument = docAccount.idDocument;
                docProfile.idLicense = docAccount.idLicense;
                docProfile.email = docAccount.userName;
                // To allow for future profile creation we create a profile for the new account
                yield profileService.createProfile(docProfile, account.type);
            }
            else {
                newProfile.status = ProfileStatus.active;
                yield profileService.createProfile(newProfile, account.type);
            }
        }
        catch (e) {
            yield accountsCollection.deleteOne({ _id: createdAccount.insertedId });
            throw new Error(e.message);
        }
    });
}
function createSession(session) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const accountExist = yield accountsCollection.findOne({ userName: session.userName });
        if (!accountExist) {
            throw new Error('La cuenta que intentas iniciar sesión no existe.');
        }
        const validPassword = yield bcrypt.compare(session.password, accountExist.password);
        if (!validPassword) {
            throw new Error('La contraseña es incorrecta.');
        }
        const returnProfile = yield profileService.getProfileByAccount(accountExist._id);
        if (!returnProfile) {
            throw new Error('El perfil que intentas iniciar sesión no existe o se encuentra desactivado.');
        }
        returnProfile.email = session.userName;
        returnProfile.accountType = returnProfile.accountType;
        return returnProfile;
    });
}
function updateAccount(token, account) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = jwt.verify(token, "7tm4puxhVbjf73X7j3vB");
        const dbData = yield accountsCollection.findOne({ _id: new ObjectId(payload.accountId) });
        if (!dbData) {
            throw new Error('La cuenta que intentas actualizar no existe.');
        }
        const samePassword = yield bcrypt.compare(account.password, dbData.password);
        if (!samePassword) {
            const salt = yield bcrypt.genSalt(10);
            account.password = yield bcrypt.hash(account.password, salt);
            yield accountsCollection.findOneAndUpdate({ _id: new ObjectId(account._id) }, { $set: { password: account.password } });
        }
    });
}
function forgotPassword(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield accountsCollection.findOne({ userName: email });
        if (!user) {
            throw new Error('El usuario no existe.');
        }
        if (!user._id) {
            throw new Error('Falta el id del usuario.');
        }
        yield tokenService.findAndDeleteToken(user._id);
        const newPassword = generator.generate({
            length: 10,
            numbers: true
        });
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(newPassword, salt);
        accountsCollection.findOneAndUpdate({ _id: new ObjectId(user._id) }, { $set: { password: hashedPassword } });
        try {
            yield transporter.sendMail({
                from: '"FoodGenie.ai" <account@foodgenie.ai>',
                to: email,
                subject: "Cambio de contraseña",
                text: "Cambio de contraseña",
                html: `Hola, pediste un cambio de contraseña. Tu nueva contraseña es: ${newPassword}`,
            });
        }
        catch (e) {
            throw new Error(e.message);
        }
    });
}
export { createAccount, createSession, updateAccount, forgotPassword };
