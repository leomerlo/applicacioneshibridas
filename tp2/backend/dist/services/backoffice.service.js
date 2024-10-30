var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db, client } from './mongo.service.js';
import { ObjectId } from 'mongodb';
import transporter from './email.service.js';
const profileColelction = db.collection('profiles');
const accountCollection = db.collection('accounts');
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const users = yield profileColelction.find({}).toArray();
        return users;
    });
}
function getDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield getUsers();
        return {
            users
        };
    });
}
function activateUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield profileColelction.findOne({ _id: new ObjectId(id) });
        if (!profile) {
            throw new Error('Perfil no encontrado');
        }
        yield profileColelction.updateOne({ _id: new ObjectId(id) }, { $set: { status: 'active' } });
        const user = yield accountCollection.findOne({ _id: new ObjectId(profile.accountId) }, { projection: { userName: 1 } });
        const email = user === null || user === void 0 ? void 0 : user.userName;
        console.log(user, email);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        yield transporter.sendMail({
            from: '"SAZ! Nutrición inteligente" <account@saz.ai>',
            to: email,
            subject: "Cuenta aprobada",
            text: "Cuenta aprobada",
            html: `Hola ${profile.name}, tu cuenta fue aprobada. Ahora podés ingresar a <a href="saz.ai">saz.ai</a>`,
        });
    });
}
export { activateUser, getDashboard, getUsers };
