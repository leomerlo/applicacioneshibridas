import { Router } from 'express'
import * as controller from '../controllers/subscription.controller.js';
import { validateToken, addProfileIdToBody, addAccountIdToBody } from '../middleware/token.middleware.js';
import { validateAdmin } from '../middleware/profile.validate.middleware.js';

const router = Router();

router.post('/subscribe', [validateToken, addProfileIdToBody], controller.subscribe);
router.post('/checkSubscriptions', [validateToken, addAccountIdToBody, validateAdmin], controller.checkSubscriptions);

export default router;