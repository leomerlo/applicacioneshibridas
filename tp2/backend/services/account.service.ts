import { MongoClient, ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { Session, Profile } from '../types/account.js';

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("foodGenie")
const accountsCollection = db.collection('accounts')
const profilesColelction = db.collection('profiles')

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
  createProfile({ accountId: createdAccount.insertedId, userName: account.userName })
}

async function createProfile(profile: Profile) {
  await client.connect()

  const profileExist = await profilesColelction.findOne({ userName: profile.userName })

  if (profileExist) {
    throw new Error('El perfil que intentas crear ya existe.')
  }

  await profilesColelction.insertOne(profile)
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

  const returnProfile = await profilesColelction.findOne({ accountId: new ObjectId(accountExist._id) });

  return returnProfile
}

export {
  createAccount,
  createSession
}