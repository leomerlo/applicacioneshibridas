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

export {
  getAllProjects,
  getProjectsBySection,
  getProjectsWithFilter,
  getProjectTechnologies,
  saveProject
}