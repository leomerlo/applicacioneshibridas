import { db } from './mongo.service.js';
import { ObjectId } from 'mongodb'
import { MercadoPagoConfig, Payment } from 'mercadopago';

const mp = new MercadoPagoConfig({
  accessToken: 'TEST-4038341833403155-021010-50257e63db3d34b3330bd198a0efc9a2-830528',
});


const profileCollection = db.collection('profiles');

const processPayment = async (paymentData: any) => {
  try {
    const payment = new Payment(mp);
    return await payment.create({ body: paymentData });
  } catch (error: any) {
    throw new Error(error);
  }
}

const subscribe = async (profileId: ObjectId, paymentData: any) => {
  paymentData.transaction_amount = 10000;
  try {
    const res = await processPayment(paymentData);
    console.log('payment processed', res);
    const date = new Date();
    await profileCollection.updateOne({ _id: new ObjectId(profileId) }, { $set: { subscription_start: date, status: 'active' } });
    console.log('user updated');
  } catch (error: any) {
    console.error('Error creating payment', error);
    await profileCollection.updateOne({ _id: new ObjectId(profileId) }, { $set: { status: 'pending' } });
    throw new Error(error);
  }
}

export {
  subscribe
}