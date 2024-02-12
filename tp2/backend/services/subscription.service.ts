import { db, client } from './mongo.service.js';
import { WithId } from 'mongodb';
const mercadopago = require('mercadopago');
mercadopago.configure({
  access_token: 'TEST-4371e7a3-cda5-4bef-a6ec-7065b6dc8220'
});

const profileColelction = db.collection('profiles');

