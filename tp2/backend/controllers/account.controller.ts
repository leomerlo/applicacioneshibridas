import { Request, Response } from 'express';
import * as services from '../services/account.service.js';
import * as tokenService from '../services/token.service.js';
import { Account } from '../types/account.js';

async function createAccount(req: Request, res: Response) {
  return services.createAccount(req.body)
  .then(() => {
      res.status(201).json({ message: "Cuenta creada" })
  })
  .catch((err) => {
      res.status(400).json({ error: { message: err.message } })
  })
}

async function createSession(req: Request, res: Response) {
  return services.createSession(req.body)
  .then(async (account) => {
    return { token: await tokenService.createToken(account as Account), account }
  })
  .then((token) => {
      res.status(200).json({ token })
  })
  .catch((err) => {
      res.status(400).json({ error: { message: err.message } })
  })
}

async function deleteSession(req: Request, res: Response) {
  const token = req.headers['auth-token'] as string;
  return tokenService.deleteToken(token)
  .then(() => {
      res.status(200).json({ message: "Sesión cerrada" })
  })
  .catch((err) => {
      res.status(400).json({ error: { message: err.message } })
  })
}

export {
  createAccount,
  createSession,
  deleteSession
}