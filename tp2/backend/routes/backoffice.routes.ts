import { Router } from 'express'
import * as controller from '../controllers/backoffice.controller.js';
import { validateToken } from '../middleware/token.middleware.js';
import { validateAdmin } from '../middleware/profile.validate.middleware.js';
import { addAccountIdToBody } from '../middleware/token.middleware.js';

const router = Router();

router.get('/dashboard',[validateToken, addAccountIdToBody, validateAdmin], controller.getDashboard);
router.post('/account',[validateToken, addAccountIdToBody, validateAdmin], controller.createAdmin);

export default router;