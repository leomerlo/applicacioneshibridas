import { NextFunction, Request, Response } from 'express';
import * as tokenService from '../services/token.service.js';

async function validateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['auth-token']

  if (!token) {
    return res.status(401).json({ error: { message: 'No se ha enviado el token' } })
  }

  const account = await tokenService.validateToken(token as string);

  if (!account) {
    return res.status(401).json({ error: { message: 'Token inválido' } })
  }
  
  next();
}

async function addProfileIdToBody(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['auth-token']

  const account = await tokenService.validateToken(token as string);

  if (!account) {
    return res.status(401).json({ error: { message: 'Token inválido' } })
  }

  req.body.profileId = account._id;
  
  next();
}

async function addAccountIdToBody(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['auth-token']

  const account = await tokenService.validateToken(token as string);

  if (!account) {
    return res.status(401).json({ error: { message: 'Token inválido' } })
  }

  req.body.accountId = account.accountId;
  
  next();
}

export {
  validateToken,
  addProfileIdToBody,
  addAccountIdToBody
}