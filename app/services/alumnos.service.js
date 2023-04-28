import { MongoClient } from 'mongodb'

const client = new MongoClient("mongodb://127.0.0.1:27017")
const db = client.db("alumnos");

async function getAlumnos() {
  await client.connect()
  return db.collection("alumnos").find({ $or : [
    { deleted : { $exists : false } },
    { deleted : false },
  ]}).toArray();
}

async function getAlumnosEliminados() {
  await client.connect()
  return db.collection("alumnos").find({ deleted : true }).toArray();
}

async function getAlumnosByLegajo(legajo, deleted = false) {
  await client.connect()
  let query = {
    legajo: legajo,
    $or : [
      { deleted: { $exists : false } },
      { deleted: false },
    ]
  };
  if(deleted) {
    query.$or[0].deleted.$exists = true
  }
  return db.collection("alumnos").findOne(query);
}

async function createAlumno(alumno) {
  await client.connect()
  return db.collection("alumnos").insertOne(alumno);
}

async function updateAlumno(alumno) {
  await client.connect()
  return db.collection("alumnos").findOneAndReplace({ legajo: alumno.legajo}, alumno);
}

export {
  getAlumnos,
  getAlumnosByLegajo,
  createAlumno,
  updateAlumno,
  getAlumnosEliminados
}