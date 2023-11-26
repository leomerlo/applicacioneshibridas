import { NextFunction, Request, Response } from 'express';
import * as accountSchema from '../schemas/account.schema.js';

async function validateAccount(req: Request, res: Response, next: NextFunction) {
  return accountSchema.account.validate(req.body, { abortEarly: false })
    .then((account) => {
      req.body = account
      next()
    })
    .catch((err) => {
      res.status(400).json({ error: { message: err.errors } })
    })
}

export {
  validateAccount
}