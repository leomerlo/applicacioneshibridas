import { Router } from 'express';
import * as controller from '../controllers/account.controller.js';
import { validateAccount } from '../middleware/account.validate.middleware.js';
import { validateToken } from '../middleware/token.validate.middleware.js';
const router = Router();
router.post('/account', [validateAccount], controller.createAccount);
router.post('/session', [validateAccount], controller.createSession);
router.delete('/session', [validateToken], controller.deleteSession);
export default router;
