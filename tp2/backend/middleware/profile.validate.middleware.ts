import { NextFunction, Request, Response } from 'express';
import * as profileSchema from '../schemas/profile.schema.js';
import * as profileService from '../services/profile.service.js';
import { DocProfile } from '../types/profile.js';

async function validateProfileData(req: Request, res: Response, next: NextFunction) {
  return profileSchema.profile.validate(req.body, { abortEarly: false, stripUnknown: true })
  .then((account) => {
    req.body = account
    next()
  })
  .catch((err) => {
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

export {
  validateProfileData,
  validateDoctor
}