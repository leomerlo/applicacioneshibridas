import { db, client } from './mongo.service.js';
import { WithId } from 'mongodb';

const profileColelction = db.collection('profiles');

export type Dashboard = {
  users: Promise<WithId<any>[]>;
}

async function getUsers(): Promise<WithId<any>> {
  await client.connect()

  const users = await profileColelction.find({}).toArray();

  return users;
}

async function getDashboard(): Promise<Dashboard> {
  const users = await getUsers();

  return {
    users
  }
}

export {
  getDashboard
}