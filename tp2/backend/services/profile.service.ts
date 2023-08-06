import { ObjectId } from 'mongodb'
import { Profile, DocProfile } from '../types/profile.js';
import jwt from 'jsonwebtoken';
import * as profileSchema from '../schemas/profile.schema.js';
import { db, client } from './mongo.service.js';
import { ProfileType } from '../schemas/profile.schema.js';

const profilesColelction = db.collection('profiles')

async function createProfile(profile: Profile | DocProfile, type: profileSchema.ProfileType) {
  await client.connect()

  const schema = type === profileSchema.ProfileType.user ? profileSchema.profile : profileSchema.docProfile;

  await schema.validate(profile, { abortEarly: false, stripUnknown: true })
    .then(async (profile) => {
      // Since we only have one profile for each user we'll check if the accountId already exists
      const profileExist = await profilesColelction.findOne({ accountId: new ObjectId(profile.accountId) })

      if (profileExist) {
        throw new Error('El perfil que intentas crear ya existe.')
      }

      await profilesColelction.insertOne(profile)
    })
    .catch((err) => {
      console.log(err);
      throw new Error('Faltan datos para crear el perfil.')
    })
}

async function getProfile(profileId: ObjectId): Promise<Profile | DocProfile | null> {
  await client.connect()
  const profile = await profilesColelction.findOne<Profile | DocProfile>({ _id: new ObjectId(profileId) })

  if(!profile) {
    throw new Error('El perfil que intentas obtener no existe.')
  }

  profile.accountType = profile.idDocument && profile.idLicense ? ProfileType.doc : ProfileType.user;

  return profile;
}

async function getProfileByAccount(accountId: ObjectId) {
  await client.connect()
  return profilesColelction.findOne<Profile | DocProfile>({ accountId: new ObjectId(accountId) })
}

async function updateProfile(token: string, profile: Profile | DocProfile) {
  await client.connect()

  const payload = jwt.verify(token, "7tm4puxhVbjf73X7j3vB") as Profile | DocProfile;

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