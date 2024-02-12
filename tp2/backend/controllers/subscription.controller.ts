import { Request, Response } from 'express';
import * as subscribeService from '../services/subscription.service.js';

const subscribe = async (req: Request, res: Response) => {
  const profileId = req.body.profileId;
  delete req.body.profileId;
  const paymentData = req.body;
  console.log('paymentData', paymentData);
  try {
    await subscribeService.subscribe(profileId, paymentData);
    return res.status(201).json({ message: 'Payment created' });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating payment', error });
  }
};


export { subscribe };