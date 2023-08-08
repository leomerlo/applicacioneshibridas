import { ObjectId } from 'mongodb';
import { Session } from '../types/account.js';
import * as accountService from './account.service.js';
import { Profile } from '../types/profile.js';
import { db, client } from './mongo.service.js';

const profilesColelction = db.collection('profiles')

export async function addPatient(docId: string, patient: Session) {
  patient.type = 'user';
  patient.password = '1234';
  patient.docId = new ObjectId(docId);
  accountService.createAccount(patient);
}

export async function getPatients(docId: string) {
  await client.connect();
  return await profilesColelction.find({ docId: new ObjectId(docId) }).toArray()
}

export async function getPatient(docId: string, patientId: string) {
  await client.connect();
  return await profilesColelction.findOne({ docId: new ObjectId(docId), _id: new ObjectId(patientId) })
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