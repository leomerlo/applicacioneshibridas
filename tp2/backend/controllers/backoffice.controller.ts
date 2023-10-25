import { Request, Response } from 'express';
import * as services from '../services/backoffice.service.js';
import * as accountServices from '../services/account.service.js';
import type { Dashboard } from '../services/backoffice.service.js';

async function getDashboard(req: Request, res: Response) {
  await services.getDashboard()
  .then((data: Dashboard) => {
    res.status(200).json(data);
  })
}

async function createAdmin(req: Request, res: Response) {
  return accountServices.createAccount(req.body)
  .then(() => {
    res.status(201).json({ message: "Cuenta creada" })
  })
  .catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

export {
  getDashboard,
  createAdmin
}