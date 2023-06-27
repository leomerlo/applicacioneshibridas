import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("AH20231CP1");

async function getAllClients() {
  await client.connect()
  return db.collection("Clients").find().toArray();
}

async function getClientById(id) {
  await client.connect()
  // return db.collection("Clients").findOne({ _id: new ObjectId(id) });
  return db.collection("Clients").aggregate([{
    $lookup: {
      from: "Projects",
      localField: "_id",
      foreignField: "client_id",
      as: "projects"
    }
  }]).toArray();
}

async function saveClient(payload) {
  await client.connect()
  return db.collection("Clients").insertOne(payload);
}

async function updateClient(id, payload) {
  await client.connect()
  return db.collection("Clients").findOneAndReplace({ _id: new ObjectId(id) }, payload);
}

async function deleteClient(id) {
  await client.connect()
  return db.collection("Clients").findOneAndDelete({ _id: new ObjectId(id) });
}

export {
  getAllClients,
  getClientById,
  updateClient,
  saveClient,
  deleteClient
}