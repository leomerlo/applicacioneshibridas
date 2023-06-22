import { Request, Response } from 'express';
import * as planService from '../services/plans.service.js';
import * as recipiesService from '../services/recipies.service.js';
import { Ingredients } from '../types/recipies.js';
import { Plan } from '../types/plan.js';

async function generatePlan(req: Request, res: Response) {
  const profileId = req.body.profileId;
  
  planService.generatePlan(profileId)
  .then(() => {
    res.status(201).json({ message: "Nuevo plan creado" })
  })
  .catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

async function getPlan(req: Request, res: Response) {
  const profileId = req.body.profileId;

  planService.getPlan(profileId)
  .then((plan) => {
    res.status(201).json(plan)
  })
  .catch((err) => {
    res.status(400).json({ error: { message: err.message } })
  })
}

async function getList(req: Request, res: Response) {
  const profileId = req.body.profileId;
  const ingredients: Ingredients[] = [];

  try {
    const list = await planService.getList(profileId);

    if(list) {
      console.log('List already exists');
      return res.status(200).json(list);
    } else {
      console.log('List does not exits, generating...');
      
      const plan: Plan = await planService.getPlan(profileId);

      const promises = Object.keys(plan.meals).map((dayKey: string) => {
        const day = plan.meals[dayKey as keyof typeof plan.meals];
        const mealPromises = Object.keys(day).map((mealKey: string) => {
          // @ts-ignore-next-line
          const meal = day[mealKey];
          return recipiesService.getRecipie(meal, profileId)
            .then((recipie) => {
              console.log('Adding ingredients for ' + recipie.name);
              recipie.ingredients.forEach((ingredient) => {
                ingredients.push(ingredient);
              });
            });
        });
        return Promise.all(mealPromises);
      });

      await Promise.all(promises);

      await planService.generateShoppingList(profileId, ingredients);

      await planService.getPlan(profileId).then((plan) => {
        res.status(201).json(plan.shoppingList);
      });
    }
  } catch (err: any) {
    res.status(400).json({ err, message: err.message });
  }
}

export {
  generatePlan,
  getPlan,
  getList
}