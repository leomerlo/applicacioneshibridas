import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { Session, DocSession } from '../types/account.js';
import * as profileService from './profile.service.js';
import { DocProfile, Profile } from '../types/profile.js';
import { ProfileType, ProfileStatus } from '../schemas/profile.schema.js';
import { db, client } from './mongo.service.js';

const accountsCollection = db.collection('accounts')

async function createAccount(account: Session | DocSession) {
  await client.connect()

  if(!account.type) {
    throw new Error('Falta el tipo de cuenta.')
  }

  // For now we only allow for one profile per user
  const accountExist = await accountsCollection.findOne({ userName: account.userName })

  if (accountExist) {
    throw new Error('La cuenta que intentas crear ya existe.')
  }

  const newAccount = {
    userName: account.userName,
    password: account.password,
  }
  const salt = await bcrypt.genSalt(10)
  newAccount.password = await bcrypt.hash(account.password, salt)

  const createdAccount = await accountsCollection.insertOne(newAccount)

  try {
    const newProfile: Profile | DocProfile = {
      accountId: new ObjectId(createdAccount.insertedId),
      name: account.userName,
      status: ProfileStatus.inactive
    };

    if(account.docId) {
      newProfile.docId = account.docId;
    }
  
    if(account.type == ProfileType.doc) {
      const docAccount = account as DocSession;
      const docProfile = newProfile as DocProfile;
  
      docProfile.accountId = new ObjectId(newProfile.accountId);
      docProfile.status = ProfileStatus.pending;
      docProfile.idDocument = docAccount.idDocument;
      docProfile.idLicense = docAccount.idLicense;
      docProfile.email = docAccount.email;
      
      // To allow for future profile creation we create a profile for the new account
      await profileService.createProfile(docProfile, account.type);
    } else {
      newProfile.status = ProfileStatus.active;
      await profileService.createProfile(newProfile, account.type);
    }
  } catch (e: any) {
    await accountsCollection.deleteOne({ _id: createdAccount.insertedId });
    throw new Error(e.message);
  }
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

  const returnProfile = await profileService.getProfileByAccount(accountExist._id);

  if (!returnProfile) {
    throw new Error('El perfil que intentas iniciar sesión no existe.')
  }

  return returnProfile
}

export {
  createAccount,
  createSession
}