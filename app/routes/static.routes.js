import express from 'express';
import * as controller from '../controllers/static.controller.js';

const routes = express.Router();

routes.get('/', controller.getHome);

export default routes;