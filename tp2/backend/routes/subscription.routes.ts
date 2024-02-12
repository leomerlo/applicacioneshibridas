import { Router } from 'express'
import * as controller from '../controllers/subscription.controller.js';
import { validateToken, addProfileIdToBody } from '../middleware/token.middleware.js';

const router = Router();

router.post('/subscribe', [validateToken, addProfileIdToBody], controller.subscribe);

export default router;