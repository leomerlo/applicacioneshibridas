import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("AH20231CP1");

async function getAllProjects() {
  await client.connect()
  return db.collection("Projects").find().toArray();
}

async function getProjectById(id) {
  await client.connect()
  return db.collection("Projects").findOne({ _id: new ObjectId(id) });
}

async function getProjectsBySection(section) {
  await client.connect()
  return db.collection("Projects").find({ section: section }).toArray();
}

async function getProjectsByClient(client) {
  await client.connect()
  return db.collection("Projects").find({ client: client }).toArray();
}

async function getProjectsWithFilter(filters) {
  await client.connect()
  return db.collection("Projects").find(filters).toArray();
}

async function getProjectTechnologies() {
  await client.connect()
  return db.collection("Projects").distinct("technologies")
}

async function saveProject(project) {
  await client.connect()
  return db.collection("Projects").insertOne(project);
}

async function updateProject(project) {
  await client.connect()
  return db.collection("Projects").findOneAndReplace({ _id: new ObjectId(project._id) }, project);
}

async function removeProject(id) {
  await client.connect()
  return db.collection("Projects").findOneAndDelete({ _id: newObjectId(id) });
}

export {
  getAllProjects,
  getProjectsBySection,
  getProjectsByClient,
  getProjectsWithFilter,
  getProjectTechnologies,
  saveProject,
  getProjectById,
  updateProject,
  removeProject
}