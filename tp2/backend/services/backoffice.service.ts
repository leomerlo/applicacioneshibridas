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
  const profile = await profileColelction.findOne({ _id: new ObjectId(id) });

  if (!profile) {
    throw new Error('Perfil no encontrado');
  }

  await profileColelction.updateOne({ _id: new ObjectId(id) }, { $set: { status: 'active' } });
  const user = await accountCollection.findOne({ _id: new ObjectId(profile.accountId) }, { projection: { userName: 1 } });
  const email = user?.userName;

  console.log(user, email);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  await transporter.sendMail({
    from: '"SAZ! Nutrición inteligente" <account@saz.ai>',
    to: email,
    subject: "Cuenta aprobada",
    text: "Cuenta aprobada",
    html: `Hola ${profile.name}, tu cuenta fue aprobada. Ahora podés ingresar a <a href="saz.ai">saz.ai</a>`,
  });
}

export {
  activateUser,
  getDashboard,
  getUsers
}