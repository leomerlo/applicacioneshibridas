import express from "express";
import * as controller from "../controllers/projects.controller.js";

const routes = express.Router();

routes.get('/projects/new', controller.getNewForm);
routes.get('/projects/:section', controller.getSection);
routes.get('/projects/:section/:technologies', controller.getFilteredList);
routes.post('/projects/new', controller.saveProject);

export default routes;