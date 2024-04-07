var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as patientsService from '../services/patients.service.js';
function getPatients(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const docId = req.body.profileId;
        patientsService.getPatients(docId).then((patients) => {
            res.status(200).json(patients);
        }).catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function getPatient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const docId = req.body.profileId;
        const patientId = req.params.patientId;
        patientsService.getPatient(docId, patientId).then((patient) => {
            res.status(200).json(patient);
        }).catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function addPatient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const docId = req.body.profileId;
        const patient = req.body;
        patientsService.addPatient(docId, patient).then(() => {
            res.status(201).json({ message: "Paciente creado" });
            // TODO: Send email to patient
        }).catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function updatePatient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const docId = req.body.profileId;
        const patientId = req.params.patientId;
        const patient = req.body;
        patientsService.updatePatient(docId, patientId, patient).then(() => {
            res.status(201).json({ message: "Paciente actualizado" });
        }).catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
function deletePatient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const docId = req.body.profileId;
        const patientId = req.params.patientId;
        patientsService.deletePatient(docId, patientId).then(() => {
            res.status(201).json({ message: "Paciente eliminado" });
        }).catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
    });
}
export { getPatients, getPatient, addPatient, updatePatient, deletePatient };
