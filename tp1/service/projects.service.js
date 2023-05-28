import { MongoClient } from 'mongodb'

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("AH20231CP1");

async function getAllProjects() {
  await client.connect()
  return db.collection("Projects").find().toArray();
}

async function getProjectsBySection(section) {
  await client.connect()
  return db.collection("Projects").find({ section: section }).toArray();
}

export {
  getAllProjects,
  getProjectsBySection
}