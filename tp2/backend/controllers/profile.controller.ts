import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as profileService from "../services/profile.service.js";
import { Profile } from "../types/profile.js";

async function updateProfile(req: Request, res: Response) {
  const token = req.headers['auth-token'] as string;
  profileService.updateProfile(token, req.body)
  .then(() => {
    res.status(201).json({ message: "Perfil actualizado" })
  })
  .catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

async function getProfile(req: Request, res: Response) {
  const token = req.headers['auth-token'] as string;
  const profile = jwt.verify(token, "7tm4puxhVbjf73X7j3vB") as Profile;
  profileService.getProfile(profile._id)
  .then((profile) => {
    res.status(201).json(profile)
  })
  .catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

export {
  updateProfile,
  getProfile
}
  