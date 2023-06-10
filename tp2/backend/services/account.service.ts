import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'
import { Session } from '../types/account.js';

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("foodGenie")
const accountsCollection = db.collection('accounts')

async function createAccount(account: Session) {
  await client.connect()

  const accountExist = await accountsCollection.findOne({ userName: account.userName })

  if (accountExist) {
      throw new Error('La cuenta que intentas crear ya existe.')
  }

  const newAccount = { ...account }
  const salt = await bcrypt.genSalt(10)
  newAccount.password = await bcrypt.hash(account.password, salt)
  await accountsCollection.insertOne(newAccount)
}

async function createSession(account: Session) {
  await client.connect()

  const accountExist = await accountsCollection.findOne({ userName: account.userName });

  if (!accountExist) {
    throw new Error('La cuenta que intentas iniciar sesión no existe.')
  }

  const validPassword = await bcrypt.compare(account.password, accountExist.password)

  if (!validPassword) {
    throw new Error('La contraseña es incorrecta.')
  }

  const returnAccount = await accountsCollection.findOne({ userName: account.userName }, { projection: { password: 0 } });

  return returnAccount
}

export {
  createAccount,
  createSession
}