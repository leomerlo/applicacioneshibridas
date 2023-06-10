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
import { MongoClient, ObjectId } from 'mongodb';
const client = new MongoClient("mongodb://127.0.0.1:27017");
const db = client.db("foodGenie");
const tokensCollection = db.collection('tokens');
function createToken(account) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jwt.sign(account, "7tm4puxhVbjf73X7j3vB");
        yield client.connect();
        yield tokensCollection.insertOne({ token, account_id: new ObjectId(account._id) });
        return token;
    });
}
function validateToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = jwt.verify(token, "7tm4puxhVbjf73X7j3vB");
            yield client.connect();
            const session = yield tokensCollection.findOne({ token, account_id: new ObjectId(payload._id) });
            if (!session) {
                return null;
            }
            return payload;
        }
        finally {
        }
    });
}
function deleteToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        yield tokensCollection.deleteOne({ token });
    });
}
export { createToken, deleteToken, validateToken };
