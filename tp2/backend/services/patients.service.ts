import { ObjectId } from 'mongodb';
import { Session } from '../types/account.js';
import * as accountService from './account.service.js';
import { Profile } from '../types/profile.js';
import { db, client } from './mongo.service.js';
import { profile } from 'console';

const profilesColelction = db.collection('profiles')

export async function addPatient(docId: string, patient: Session) {
  patient.type = 'user';
  patient.docId = new ObjectId(docId);
  try {
    await accountService.createAccount(patient);
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