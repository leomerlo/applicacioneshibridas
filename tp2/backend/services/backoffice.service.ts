import { db, client } from './mongo.service.js';
import { ObjectId, WithId } from 'mongodb';
import transporter from './email.service.js';

const profileColelction = db.collection('profiles');
const accountCollection = db.collection('accounts');

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

async function activateUser(id: string): Promise<void> {
  await profileColelction.updateOne({ _id: new ObjectId(id) }, { $set: { status: 'active' } });
  const profile = await profileColelction.findOne({ _id: new ObjectId(id) });

  if (!profile) {
    throw new Error('Perfil no encontrado');
  }

  const user = await accountCollection.findOne({ _id: new ObjectId(profile.accountId) }, { projection: { email: 1 } });
  const email = user?.email;

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  await transporter.sendMail({
    from: '"SAZ! Nutrición inteligente" <account@saz.ai>',
    to: email,
    subject: "Cuenta activada",
    text: "Cuenta activada",
    html: `Hola ${profile.name}, tu cuenta fue activada. Ahora puedes ingresar a saz.ai`,
  });
}

export {
  activateUser,
  getDashboard,
  getUsers
}