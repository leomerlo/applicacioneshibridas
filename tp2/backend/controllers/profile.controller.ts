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
  const tokenProfile = jwt.verify(token, "7tm4puxhVbjf73X7j3vB") as Profile;
  console.log('TokenProfile', tokenProfile)
  if(tokenProfile._id) {
    profileService.getProfile(tokenProfile._id)
    .then((profile) => {
      console.log('obtained profile', profile);
      if(profile) {
        profile.email = tokenProfile.email;
        res.status(200).json(profile)
      }
    })
    .catch((err) => {
      res.status(400).json({ error: { message: err.message } })
    })
  }
}

export {
  updateProfile,
  getProfile
}
  