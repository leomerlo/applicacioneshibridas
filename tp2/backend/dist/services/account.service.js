var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
const client = new MongoClient("mongodb://127.0.0.1:27017");
const db = client.db("foodGenie");
const accountsCollection = db.collection('accounts');
const profilesColelction = db.collection('profiles');
function createAccount(account) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const accountExist = yield accountsCollection.findOne({ userName: account.userName });
        if (accountExist) {
            throw new Error('La cuenta que intentas crear ya existe.');
        }
        const newAccount = Object.assign({}, account);
        const salt = yield bcrypt.genSalt(10);
        newAccount.password = yield bcrypt.hash(account.password, salt);
        const createdAccount = yield accountsCollection.insertOne(newAccount);
        // To allow for future profile creation we create a profile for the new account
        createProfile({ accountId: createdAccount.insertedId, userName: account.userName });
    });
}
function createProfile(profile) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const profileExist = yield profilesColelction.findOne({ userName: profile.userName });
        if (profileExist) {
            throw new Error('El perfil que intentas crear ya existe.');
        }
        yield profilesColelction.insertOne(profile);
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
        const returnProfile = yield profilesColelction.findOne({ accountId: new ObjectId(accountExist._id) });
        return returnProfile;
    });
}
export { createAccount, createSession };
