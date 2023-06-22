import { Request, Response } from 'express';
import * as recipiesService from '../services/recipies.service.js';
import { Recipie } from '../types/recipies.js';

async function getRecipie(req: Request, res: Response) {
  const recipie = req.params.recipie;
  const profileId = req.body.profileId;

  recipiesService.getRecipie(recipie)
  .then(async (response) => {

    if(response) {
      console.log(`Recipie ${recipie} found in database`);
      res.status(200).json(response);
      return;
    }

    console.log(`Generating recipie ${recipie}`);
    await recipiesService.generateRecipie(recipie, profileId).then((newId) => {
      console.log(`Recipie ${recipie} saved`);
      recipiesService.getRecipie(recipie).then((response) => {
        console.log(`Recipie ${recipie} retrieved from database`);
        res.status(200).json(response);
      }).catch((err) => {
        res.status(400).json({ error: { message: err.message } })
      });
    }).catch((err) => {
      res.status(400).json({ error: { message: err.message } })
    });
  })
  .catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

async function likeRecipie(req: Request, res: Response) {
  const recipie = req.params.id;
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
  const recipie = req.params.id;
  const profileId = req.body.profileId;

  recipiesService.unlikeRecipie(recipie, profileId)
  .then(() => {
    res.status(201).json({ message: "Receta removida de favoritos" })
  })
  .catch((err: any) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

export {
  getRecipie,
  likeRecipie,
  unlikeRecipie
}