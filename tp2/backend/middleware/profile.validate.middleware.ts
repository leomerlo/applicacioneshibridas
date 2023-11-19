import { ObjectId } from 'mongodb';
import { NextFunction, Request, Response } from 'express';
import * as profileSchema from '../schemas/profile.schema.js';
import * as profileService from '../services/profile.service.js';
import { DocProfile } from '../types/profile.js';
import { ProfileType } from '../schemas/profile.schema.js';

async function validateProfileData(req: Request, res: Response, next: NextFunction) {
  let userTypeSchema;
  const body = req.body.user ? req.body.user : req.body;

  if(req.body.accountType === 'doc') {
    userTypeSchema = profileSchema.docProfile;
  } else {
    userTypeSchema = profileSchema.profile;
  }

  return userTypeSchema.validate(body, { abortEarly: false, stripUnknown: true })
  .then((account) => {
    if (req.body.user) {
      req.body.user = account
    } else {
      req.body = account
    }
    
    next()
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json({ error: { message: err.message } })
  })
}

async function validateDoctor(req: Request, res: Response, next: NextFunction) {
  await profileService.getProfile(req.body.profileId)
  .then((profile) => {
    if(profile) {
      const docProfile = profile as DocProfile;
      if(docProfile.status === profileSchema.ProfileStatus.active && docProfile.idDocument) {
        next()
        return;
      }
    }

    throw new Error('No tenés los permisos correctos para realizar esta acción');
  })
  .catch((err) => {
    res.status(500).json({ error: { message: err.message } })
  })
}

async function validatePatient(req: Request, res: Response, next: NextFunction) {
  const patientId = req.params.patientId;
  const docId = req.body.profileId;
  await profileService.getProfile(new ObjectId(patientId))
  .then((profile) => {
    if(profile) {
      if(profile.docId?.equals(docId)) {
        next()
        return;
      }
    }

    throw new Error('No tenés los permisos correctos para realizar esta acción');
  })
  .catch((err) => {
    res.status(500).json({ error: { message: err.message } })
  })
}

async function validateAdmin(req: Request, res: Response, next: NextFunction) {
  await profileService.getProfileByAccount(new ObjectId(req.body.accountId))
  .then((profile) => {
    if(profile && profile.accountType === ProfileType.admin) {
      next()
      return;
    }

    throw new Error('No tenés los permisos correctos para realizar esta acción');
  })
  .catch((err) => {
    res.status(500).json({ error: { message: err.message } })
  })
}

export {
  validateProfileData,
  validateDoctor,
  validatePatient,
  validateAdmin
}