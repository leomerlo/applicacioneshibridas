var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ObjectId } from 'mongodb';
import * as accountService from './account.service.js';
import { db, client } from './mongo.service.js';
import { newPatientEmail } from './email.service.js';
import * as profileService from './profile.service.js';
const profilesColelction = db.collection('profiles');
const plansCollection = db.collection('plans');
export function addPatient(docId, patient) {
    return __awaiter(this, void 0, void 0, function* () {
        patient.type = 'user';
        patient.docId = new ObjectId(docId);
        try {
            const rawPass = patient.password;
            yield accountService.createAccount(patient);
            const doc = yield profileService.getProfile(new ObjectId(docId));
            console.log("pass", rawPass);
            yield newPatientEmail(doc, patient, rawPass);
            console.log("Email enviado");
        }
        catch (e) {
            throw new Error(e.message);
        }
    });
}
export function getPatients(docId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        return yield profilesColelction.aggregate([
            {
                "$match": { "docId": new ObjectId(docId) }
            },
            {
                "$lookup": {
                    "from": "plans",
                    "foreignField": "profileId",
                    "localField": "_id",
                    "as": "plan"
                },
            },
            {
                $project: {
                    _id: 1,
                    status: 1,
                    name: 1,
                    plan: { $first: '$plan' }
                }
            }
        ]).toArray();
    });
}
export function getPatient(docId, patientId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const profiles = yield profilesColelction.aggregate([
            {
                $match: {
                    _id: new ObjectId(patientId),
                    docId: new ObjectId(docId)
                }
            },
            {
                $lookup: {
                    from: 'plans',
                    foreignField: 'profileId',
                    localField: '_id',
                    as: 'plan'
                }
            },
            {
                $project: {
                    status: 1,
                    name: 1,
                    plan: { $first: '$plan' }
                }
            }
        ], { maxTimeMS: 60000, allowDiskUse: true }).toArray();
        return profiles[0];
    });
}
export function deletePatient(docId, patientId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        const patient = profilesColelction.findOne({ docId: new ObjectId(docId), _id: new ObjectId(patientId) });
        if (!patient) {
            throw new Error('Patient not found');
        }
        const promises = yield Promise.all([
            profilesColelction.findOneAndUpdate({ docId: new ObjectId(docId), _id: new ObjectId(patientId) }, { $unset: { docId } }),
            plansCollection.findOneAndDelete({ profileId: new ObjectId(patientId) })
        ]).catch((err) => {
            throw new Error(err.message);
        });
        if (promises[0].value === null) {
            throw new Error('Patient not found');
        }
        return promises;
    });
}
export function updatePatient(docId, patientId, patient) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        return yield profilesColelction.findOneAndUpdate({ docId: new ObjectId(docId), _id: new ObjectId(patientId) }, { $set: patient });
    });
}
export default {
    addPatient
};
