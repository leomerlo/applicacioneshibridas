import { Router } from 'express'
import * as controller from '../controllers/subscription.controller.js';

const router = Router();

router.post('/subscribe', [], controller.subscribe);

export default router;