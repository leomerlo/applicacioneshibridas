var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { db } from './mongo.service.js';
import { ObjectId } from 'mongodb';
// @ts-ignore
import { MercadoPagoConfig, Payment } from 'mercadopago';
const mp = new MercadoPagoConfig({
    accessToken: 'TEST-4038341833403155-021010-50257e63db3d34b3330bd198a0efc9a2-830528',
});
const profileCollection = db.collection('profiles');
const processPayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = new Payment(mp);
        return yield payment.create({ body: paymentData });
    }
    catch (error) {
        throw new Error(error);
    }
});
const subscribe = (profileId, paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    paymentData.transaction_amount = 10000;
    try {
        const res = yield processPayment(paymentData);
        const date = new Date();
        yield profileCollection.updateOne({ _id: new ObjectId(profileId) }, { $set: { subscription_start: date, status: 'active' } });
    }
    catch (error) {
        yield profileCollection.updateOne({ _id: new ObjectId(profileId) }, { $set: { status: 'pending' } });
        throw new Error(error);
    }
});
const checkSubscriptions = () => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    // create a date object a year from now
    date.setFullYear(date.getFullYear() - 1);
    const profiles = yield profileCollection.find({ status: 'active', subscription_start: { $lt: date } }).toArray();
    return profiles;
});
const deactivate = (profileId) => __awaiter(void 0, void 0, void 0, function* () {
    yield profileCollection.updateOne({ _id: profileId }, { $set: { status: 'pending' }, $unset: { subscription_start: '' } });
});
export { subscribe, checkSubscriptions, deactivate };
