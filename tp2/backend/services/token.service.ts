import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb'
import { Profile } from '../types/profile';

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("foodGenie")
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

export {
  createToken,
  deleteToken,
  validateToken
}