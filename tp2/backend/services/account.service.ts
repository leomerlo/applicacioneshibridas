import { MongoClient, ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { Session } from '../types/account.js';
import { createProfile, getProfileByAccount } from './profile.service.js'

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

  const createdAccount = await accountsCollection.insertOne(newAccount)

  // To allow for future profile creation we create a profile for the new account
  createProfile({ accountId: createdAccount.insertedId, name: account.userName, preferences: 'Ninguna', restrictions: 'Ninguna' })
}

async function createSession(session: Session) {
  await client.connect()

  const accountExist = await accountsCollection.findOne({ userName: session.userName });

  if (!accountExist) {
    throw new Error('La cuenta que intentas iniciar sesión no existe.')
  }

  const validPassword = await bcrypt.compare(session.password, accountExist.password)

  if (!validPassword) {
    throw new Error('La contraseña es incorrecta.')
  }

  const returnProfile = getProfileByAccount(accountExist._id);

  return returnProfile
}

export {
  createAccount,
  createSession
}