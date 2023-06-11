import { Router } from 'express';
import * as controller from '../controllers/recipies.controller.js';
import { validateToken, addProfileIdToBody } from '../middleware/token.middleware.js';

const router = Router();

router.get('/recipie/:recipie', [validateToken], controller.getRecipie);
router.get('/recipie/like/:id', [validateToken, addProfileIdToBody], controller.likeRecipie);
router.get('/recipie/unlike/:id', [validateToken, addProfileIdToBody], controller.unlikeRecipie);

export default router;