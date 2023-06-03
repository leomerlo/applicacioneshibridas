import { MongoClient } from 'mongodb'

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("AH20231CP1");

async function getAllProjects() {
  await client.connect()
  return db.collection("Projects").find().toArray();
}

async function getProjectById(id) {
  await client.connect()
  return db.collection("Projects").findOne({ id: id });
}

async function getProjectsBySection(section) {
  await client.connect()
  return db.collection("Projects").find({ section: section }).toArray();
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
  return db.collection("Projects").findOneAndReplace({ id: project.id }, project);
}

async function removeProject(id) {
  await client.connect()
  return db.collection("Projects").findOneAndDelete({ id: id });
}

export {
  getAllProjects,
  getProjectsBySection,
  getProjectsWithFilter,
  getProjectTechnologies,
  saveProject,
  getProjectById,
  updateProject,
  removeProject
}