import { Request, Response } from 'express';
import * as services from '../services/backoffice.service.js';
import * as accountServices from '../services/account.service.js';
import * as profileServices from '../services/profile.service.js';
import type { Dashboard } from '../services/backoffice.service.js';
import { ObjectId } from 'mongodb';

async function getDashboard(req: Request, res: Response) {
  await services.getDashboard()
  .then((data: Dashboard) => {
    res.status(200).json(data);
  })
}

async function createUser(req: Request, res: Response) {
  return accountServices.createAccount(req.body)
  .then(() => {
    res.status(201).json({ message: "Cuenta creada" })
  })
  .catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

async function editUser(req: Request, res: Response) {
  const token = req.headers['auth-token'] as string;
  const profileId = req.params.profileId;

  return profileServices.updateProfile(token, req.body.user, new ObjectId(profileId))
  .then(() => {
    res.status(200).json({ message: "Cuenta editada" })
  })
  .catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

async function getUser(req: Request, res: Response) {
  const profileId = req.params.profileId;

  console.log(profileId);

  return profileServices.getProfile(new ObjectId(profileId))
  .then((profile) => {
    res.status(200).json(profile)
  })
  .catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

export {
  getDashboard,
  createUser,
  editUser,
  getUser