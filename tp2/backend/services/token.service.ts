import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb'
import { Account } from '../types/account';

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("foodGenie")
const tokensCollection = db.collection('tokens')

async function createToken(account: Account) {

  const token = jwt.sign(account, "7tm4puxhVbjf73X7j3vB")

  await client.connect()

  await tokensCollection.insertOne({ token, account_id: new ObjectId(account._id) })

  return token
}

async function validateToken(token: string) {
  try {
    const payload = jwt.verify(token, "7tm4puxhVbjf73X7j3vB") as Account;

    await client.connect();

    const session = await tokensCollection.findOne({ token, account_id: new ObjectId(payload._id) });

    if(!session) {
      return null
    }

    return payload;
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