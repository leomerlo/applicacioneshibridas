import { NextFunction, Request, Response } from 'express';
import * as accountSchema from '../schemas/account.schema.js';

async function validateAccount(req: Request, res: Response, next: NextFunction) {
  return accountSchema.account.validate(req.body, { abortEarly: false, stripUnknown: true })
    .then((account) => {
      // @ts-ignore-next-line
      // Todo: body does not exist in Response type
      res.body = account
      next()
    })
    .catch((err) => {
      res.status(400).json({ error: { message: err.message } })
    })
}

export {
  validateAccount
}