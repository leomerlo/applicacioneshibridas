import { ObjectId } from 'mongodb'
import { Profile, DocProfile } from '../types/profile.js';
import jwt from 'jsonwebtoken';
import * as profileSchema from '../schemas/profile.schema.js';
import { db, client } from './mongo.service.js';
import { ProfileType } from '../schemas/profile.schema.js';

const profilesColelction = db.collection('profiles')

async function createProfile(profile: Profile | DocProfile, type: ProfileType) {
  await client.connect()

  let schema = profileSchema.profile;

  if(type === ProfileType.doc) {
    schema = profileSchema.docProfile;
  }

  await schema.validate(profile, { abortEarly: true, stripUnknown: true })
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
  const profile = await profilesColelction.findOne<Profile | DocProfile>({ _id: new ObjectId(profileId), 'status': { $exists: true } })
  const account = await db.collection('accounts').findOne({ _id: new ObjectId(profile?.accountId) });

  if(!profile) {
    throw new Error('El perfil que intentas obtener no existe.')
  }

  profile.email = account?.userName || '';
  profile.accountType = profile.accountType || ProfileType.user;

  return profile;
}

async function getProfileByAccount(accountId: ObjectId) {
  await client.connect()
  return profilesColelction.findOne<Profile | DocProfile>({ accountId: new ObjectId(accountId), 'status': { $exists: true } })
}

async function updateProfile(token: string, profile: Profile | DocProfile, profileId: ObjectId | null = null) {
  await client.connect()
  const payload = await jwt.verify(token, "7tm4puxhVbjf73X7j3vB") as Profile | DocProfile;
  const updateId = profileId ? profileId : payload._id;

  if(profileId && payload.accountType !== ProfileType.admin) {
    throw new Error('No tienes permisos para modificar este perfil.')
  }

  profile._id = new ObjectId(updateId);

  const update = {
    ...profile
  }
  
  if(payload.docId) {
    update.docId = new ObjectId(payload.docId)
  }

  // Merge the new profile with the existing one
  const existingProfile = await profilesColelction.findOne({ _id: new ObjectId(updateId) });
  const mergedProfile = { ...existingProfile, ...update };

  const updated = await profilesColelction.replaceOne({ _id: new ObjectId(updateId) }, mergedProfile);

  if (updated.matchedCount == 0) {
    throw new Error('El perfil que intentas modificar no existe.')
  }
}

async function deactivateProfile(profileId: ObjectId) {
  await client.connect()
  const updated = await profilesColelction.updateOne({ _id: new ObjectId(profileId) }, { $set: { status: "inactive" } })

  if (updated.matchedCount == 0) {
    throw new Error('El perfil que intentas modificar no existe.')
  }
}

async function getAdmins() {
  await client.connect();
 // Join profile with account to get the email with foreign key profiles.accountId
  return profilesColelction.aggregate([
    {
      "$match": { "accountType": ProfileType.admin }
    },
    {
      "$lookup": {
        "from": "accounts",
        "foreignField": "_id",
        "localField": "accountId",
        "as": "account"
      },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        name: 1,
        email: { $first: '$account.userName' }
      }
    }
  ]).toArray();
}

export {
  createProfile,
  getProfile,
  getAdmins,
  updateProfile,
  getProfileByAccount,
  deactivateProfile
}