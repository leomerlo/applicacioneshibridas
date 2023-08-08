import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { Session, DocSession } from '../types/account.js';
import * as profileService from './profile.service.js';
import { DocProfile, Profile } from '../types/profile.js';
import { ProfileType, ProfileStatus } from '../schemas/profile.schema.js';
import { db, client } from './mongo.service.js';
import * as tokenService from './token.service.js';
import transporter from './email.service.js';

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

async function forgotPassword(email: string) {
  const user = await accountsCollection.findOne<Profile>({ userName: email });

  if (!user) {
    throw new Error('El usuario no existe.');
  }

  await tokenService.findAndDeleteToken(user._id);
  const profile = await profileService.getProfileByAccount(user._id);

  if (!profile) {
    throw new Error('El perfil no existe.');
  }

  const resetToken = await tokenService.createToken(profile as Profile);

  const link = `https://localhost:8080/passwordReset?token=${resetToken}&id=${user._id}`;

  try {
    await transporter.sendMail({
      from: '"FoodGenie.ai" <account@foodgenie.ai>',
      to: email,
      subject: "Recuperación de contraseña",
      text: "Recuperación de contraseña",
      html: `<a href="${link}">Click aquí para recuperar tu contraseña</a>`,
    });
  } catch (e: any) {
    throw new Error(e.message);
  }

  return link;
}

async function resetPassword(accountId: string, token: string, password: string) {
  const dbToken = await tokenService.findToken(accountId);
  if (!dbToken) {
    throw new Error('El token no existe.');
  }

  const isValid = token === dbToken.token;

  if (!isValid) {
    throw new Error("El token es invalido o expiró.");
  }

  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt);
    const user = await accountsCollection.findOne({ _id: new ObjectId(accountId) });

    if (!user) {
      throw new Error('El usuario no existe.');
    }

    await accountsCollection.updateOne({ _id: new ObjectId(accountId) }, { $set: { password: hash } });

    await transporter.sendMail({
      from: '"Leandro Merlo" <merloleandro@gmail.com>',
      to: user.userName,
      subject: "Contraseña reestablecida",
      text: "Contraseña reestablecida",
      html: `La contraseña se reestablecio correctamente.`,
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export {
  createAccount,
  createSession,
  forgotPassword,
  resetPassword
}