import { Request, Response } from 'express';
import * as recipiesService from '../services/recipies.service.js';

async function getRecipie(req: Request, res: Response) {
  const recipie = req.params.recipie;
  const profileId = req.body.profileId;

  recipiesService.getRecipie(recipie, profileId)
  .then(async (response) => {
    if(response) {
      res.status(200).json(response);
    } else {
      res.status(400).json({ error: { message: 'No se encontró la receta' } })  
    }
  })
  .catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

async function likeRecipie(req: Request, res: Response) {
  const recipie = req.params.name;
  const profileId = req.body.profileId;

  recipiesService.likeRecipie(recipie, profileId)
  .then(() => {
    res.status(201).json({ message: "Receta agregada a favoritos" })
  })
  .catch((err: any) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

async function unlikeRecipie(req: Request, res: Response) {
  const recipie = req.params.name;
  const profileId = req.body.profileId;

  recipiesService.unlikeRecipie(recipie, profileId)
  .then(() => {
    res.status(200).json({ message: "Receta removida de favoritos" })
  })
  .catch((err: any) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

async function getLikedRecipies(req: Request, res: Response) {
  const profileId = req.body.profileId;

  recipiesService.getLikedRecipies(profileId)
  .then((recipies) => {
    res.status(200).json(recipies);
  })
  .catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

async function newRecipie(req: Request, res: Response) {
  const preferences = req.body.preferences;
  const restrictions = req.body.restrictions;
  const day = req.body.day;
  const meal = req.body.meal;

  if(!preferences || !restrictions || !day || !meal) {
    res.status(400).json({ error: { message: 'Faltan datos' } })
    return;
  }

  recipiesService.newRecipie(preferences, restrictions, day, meal)
  .then((recipie) => {
    res.status(200).json(recipie);
  })
  .catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

export {
  getRecipie,
  likeRecipie,
  unlikeRecipie,
  getLikedRecipies,
  newRecipie
}