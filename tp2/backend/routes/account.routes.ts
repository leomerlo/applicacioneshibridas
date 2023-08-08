import { Router } from 'express'
import * as controller from '../controllers/account.controller.js';
import { validateAccount } from '../middleware/account.validate.middleware.js';
import { validateToken } from '../middleware/token.middleware.js';
import { addAccountIdToBody } from '../middleware/token.middleware.js';

const router = Router();

router.post('/account', [validateAccount], controller.createAccount);
router.patch('/account', [validateAccount, addAccountIdToBody], controller.updateAccount);
router.post('/session', [validateAccount], controller.createSession);
router.delete('/session', [validateToken], controller.deleteSession);
router.post('/account/forgot', controller.forgotPassword);

export default router;