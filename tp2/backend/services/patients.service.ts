import { ObjectId } from 'mongodb';
import { Session } from '../types/account.js';
import * as accountService from './account.service.js';
import { Profile } from '../types/profile.js';
import { db, client } from './mongo.service.js';
import transporter from './email.service.js';
import * as profileService from './profile.service.js';

const profilesColelction = db.collection('profiles')

export async function addPatient(docId: string, patient: Session) {
  patient.type = 'user';
  patient.docId = new ObjectId(docId);
  try {
    const rawPass = patient.password;
    await accountService.createAccount(patient);
    const doc = await profileService.getProfile(new ObjectId(docId));
    console.log("pass", rawPass);
    await transporter.sendMail({
      from: '"Leandro Merlo" <merloleandro@gmail.com>',
      to: patient.userName,
      subject: "Bienvenid@ a FoodGenie",
      text: "Bienvenid@ a FoodGenie, tu cuenta fue creada exitosamente.",
      html: `
        ${doc?.name} te ha invitado a FoodGenie.ai.

        Ingresá aqui: <a href="http://127.0.0.1:5173">FoodGenie.ai</a>

        Usando tu email y la contraseña ${rawPass}.

        Recordá cambiar tu contraseña una vez que ingreses al sistema.
      `,
    });
    console.log("Email enviado");
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function getPatients(docId: string) {
  await client.connect();
  return await profilesColelction.aggregate([
    {
      "$match": { "docId": new ObjectId(docId) }
    },
    {
      "$lookup": {
        "from": "plans",
        "foreignField": "profileId",
        "localField": "_id",
        "as": "plan"
      },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        name: 1,
        plan: { $first: '$plan' }
      }
    }
  ]).toArray();
}

export async function getPatient(docId: string, patientId: string) {
  await client.connect();
  const profiles = await profilesColelction.aggregate(
    [
      {
        $match: {
          _id: new ObjectId(patientId),
          docId: new ObjectId(docId)
        }
      },
      {
        $lookup: {
          from: 'plans',
          foreignField: 'profileId',
          localField: '_id',
          as: 'plan'
        }
      },
      {
        $project: {
          status: 1,
          name: 1,
          plan: { $first: '$plan' }
        }
      }
    ],
    { maxTimeMS: 60000, allowDiskUse: true }
  ).toArray();
  return profiles[0];
}

export async function deletePatient(docId: string, patientId: string) {
  await client.connect();
  return await profilesColelction.findOneAndUpdate({ docId: new ObjectId(docId), _id: new ObjectId(patientId) }, { $set: { status: 'inactive' } });
}

export async function updatePatient(docId: string, patientId: string, patient: Profile) {
  await client.connect();
  return await profilesColelction.findOneAndUpdate({ docId: new ObjectId(docId), _id: new ObjectId(patientId) }, { $set: patient });
}

export default {
  addPatient
}