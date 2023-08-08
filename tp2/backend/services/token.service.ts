import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb'
import { Profile } from '../types/profile';
import { db, client } from './mongo.service.js';

const tokensCollection = db.collection('tokens')

async function createToken(profile: Profile) {
  const token = jwt.sign(profile, "7tm4puxhVbjf73X7j3vB")

  await client.connect()

  await tokensCollection.insertOne({ token, profileId: new ObjectId(profile._id), accountId: new ObjectId(profile.accountId) })

  return token
}

async function validateToken(token: string) {
  try {
    const payload = jwt.verify(token, "7tm4puxhVbjf73X7j3vB") as Profile;

    await client.connect();

    const session = await tokensCollection.findOne({ token, accountId: new ObjectId(payload.accountId), profileId: new ObjectId(payload._id) });

    if(!session) {
      return null
    }

    return payload;
  } catch (error) {
    throw error;
  }
}

async function deleteToken(token: string) {
  await client.connect()
  await tokensCollection.deleteOne({ token })
}

async function findAndDeleteToken(accountId: string) {
  await client.connect()
  await tokensCollection.findOneAndDelete({ accountId: new ObjectId(accountId) })
}

async function findToken(accountId: string) {
  await client.connect()
  return await tokensCollection.findOne({ accountId: new ObjectId(accountId) })
}

export {
  createToken,
  deleteToken,
  validateToken,
  findAndDeleteToken,
  findToken
}