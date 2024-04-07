var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { db, client } from './mongo.service.js';
const tokensCollection = db.collection('tokens');
function createToken(profile) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jwt.sign(profile, "7tm4puxhVbjf73X7j3vB");
        yield client.connect();
        yield tokensCollection.insertOne({ token, profileId: new ObjectId(profile._id), accountId: new ObjectId(profile.accountId) });
        return token;
    });
}
function validateToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = jwt.verify(token, "7tm4puxhVbjf73X7j3vB");
            yield client.connect();
            const session = yield tokensCollection.findOne({ token, accountId: new ObjectId(payload.accountId), profileId: new ObjectId(payload._id) });
            if (!session) {
                return null;
            }
            return payload;
        }
        catch (error) {
            throw error;
        }
    });
}
function deleteToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        yield tokensCollection.deleteOne({ token });
    });
}
function findAndDeleteToken(accountId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        yield tokensCollection.findOneAndDelete({ accountId: new ObjectId(accountId) });
    });
}
function findToken(accountId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        return yield tokensCollection.findOne({ accountId: new ObjectId(accountId) });
    });
}
export { createToken, deleteToken, validateToken, findAndDeleteToken, findToken };
