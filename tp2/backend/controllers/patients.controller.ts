import { Request, Response } from 'express';
import * as patientsService from '../services/patients.service.js';

async function getPatients(req: Request, res: Response) {
  const docId = req.body.profileId;
  patientsService.getPatients(docId).then((patients) => {
    res.status(200).json(patients)
  }).catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  });
}

async function getPatient(req: Request, res: Response) {
  const docId = req.body.profileId;
  const patientId = req.params.patientId;
  patientsService.getPatient(docId, patientId).then((patient) => {
    res.status(200).json(patient)
  }).catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  });
}

async function addPatient(req: Request, res: Response) {
  const docId = req.body.profileId;
  const patient = req.body;
  patientsService.addPatient(docId, patient).then(() => {
    res.status(201).json({ message: "Paciente creado" })
  }).catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  });
}

async function updatePatient(req: Request, res: Response) {
  const docId = req.body.profileId;
  const patientId = req.params.patientId;
  const patient = req.body;
  patientsService.updatePatient(docId, patientId, patient).then(() => {
    res.status(201).json({ message: "Paciente actualizado" })
  }).catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  });
}

async function deletePatient(req: Request, res: Response) {
  const docId = req.body.profileId;
  const patientId = req.params.patientId;
  patientsService.deletePatient(docId, patientId).then(() => {
    res.status(201).json({ message: "Paciente eliminado" })
  }).catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  });
}

export {
  getPatients,
  getPatient,
  addPatient,
  updatePatient,
  deletePatient
}