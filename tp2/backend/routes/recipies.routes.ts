import { Router } from 'express';
import * as controller from '../controllers/recipies.controller.js';
import { validateToken, addProfileIdToBody } from '../middleware/token.middleware.js';

const router = Router();

router.get('/recipie/likes', [validateToken, addProfileIdToBody], controller.getLikedRecipies);
router.get('/recipie/:profileId/:recipie', [validateToken, addProfileIdToBody], controller.getRecipie);
router.get('/recipie/', [validateToken, addProfileIdToBody], controller.newRecipie);
router.post('/recipie/like/:name', [validateToken, addProfileIdToBody], controller.likeRecipie);
router.delete('/recipie/unlike/:name', [validateToken, addProfileIdToBody], controller.unlikeRecipie);

export default router;