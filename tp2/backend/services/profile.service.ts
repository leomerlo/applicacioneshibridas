import { MongoClient, ObjectId } from 'mongodb'
import { Profile } from '../types/profile.js';
import jwt from 'jsonwebtoken';

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("foodGenie")
const profilesColelction = db.collection('profiles')

async function createProfile(profile: Profile) {
  await client.connect()

  // Since we only have one profile for each user we'll check if the accountId already exists
  const profileExist = await profilesColelction.findOne({ accountId: new ObjectId(profile.accountId) })

  if (profileExist) {
    throw new Error('El perfil que intentas crear ya existe.')
  }

  await profilesColelction.insertOne(profile)
}

async function getProfile(profileId: ObjectId): Promise<Profile | null> {
  await client.connect()
  return profilesColelction.findOne<Profile>({ _id: new ObjectId(profileId) })
}

async function getProfileByAccount(accountId: ObjectId) {
  await client.connect()
  return profilesColelction.findOne<Profile>({ accountId: new ObjectId(accountId) })
}

async function updateProfile(token: string, profile: Profile) {
  await client.connect()

  const payload = jwt.verify(token, "7tm4puxhVbjf73X7j3vB") as Profile;

  const update = {
    ...profile,
    accountId: new ObjectId(payload.accountId)
  }

  const updated = await profilesColelction.replaceOne({ _id: new ObjectId(payload._id) }, update);

  if (updated.matchedCount == 0) {
    throw new Error('El perfil que intentas modificar no existe.')
  }
}

export {
  createProfile,
  getProfile,
  updateProfile,
  getProfileByAccount
}