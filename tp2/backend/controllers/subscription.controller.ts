import { Request, Response } from 'express';
import * as subscribeService from '../services/subscription.service.js';

const subscribe = async (req: Request, res: Response) => {
  const profileId = req.body.profileId;
  delete req.body.profileId;
  const paymentData = req.body;

  try {
    await subscribeService.subscribe(profileId, paymentData);
    return res.status(201).json({ message: 'Payment created' });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating payment', error });
  }
};

const checkSubscriptions = async (req: Request, res: Response) => {
  try {
    const response = await subscribeService.checkSubscriptions();

    console.log('Outdated Subscriptions', response.length);

    await Promise.all(response.map(async (profile) => {
      await subscribeService.deactivate(profile._id);
    }));

    return res.status(200).json({ message: 'Subscriptions checked' });
    
  } catch (error) {
    return res.status(500).json({ message: 'Error checking subscriptions', error });
  }
}


export { subscribe, checkSubscriptions };