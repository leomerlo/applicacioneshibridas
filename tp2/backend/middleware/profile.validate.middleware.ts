import { NextFunction, Request, Response } from 'express';
import * as profileSchema from '../schemas/profile.schema.js';

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

export {
  validateProfileData
}