import { Request, Response } from 'express';
import * as services from '../services/backoffice.service.js';
import type { Dashboard } from '../services/backoffice.service.js';

async function getDashboard(req: Request, res: Response) {
  await services.getDashboard()
  .then((data: Dashboard) => {
    res.status(200).json(data);
  })
}

export {
  getDashboard
}