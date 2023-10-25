import { ProfileType } from '../schemas/profile.schema.js';
import { db, client } from './mongo.service.js';
import { Profile } from '../types/profile.js';
import { WithId } from 'mongodb';

const planColelction = db.collection('plans');
const profileColelction = db.collection('profiles');

export type Dashboard = {
  users: any;
  docs: number;
  awaiting: any;
  plans: number;
}

async function getDashboard(): Promise<Dashboard> {
  await client.connect()

  const users = await profileColelction.find({}, { projection: { name: 1, accountId: 1 }}).toArray();
  const docs = await profileColelction.find({ accountType: ProfileType.doc }).toArray();
  const awaiting = await profileColelction.find({ status: 'pending' }).toArray();
  const plans = await planColelction.find({}).toArray();

  return {
    users: users,
    docs: docs.length,
    awaiting: awaiting,
    plans: plans.length,
  } 
}

export {
  getDashboard
}