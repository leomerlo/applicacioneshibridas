import express from "express";
import * as controller from "../controllers/projects.controller.js";

const routes = express.Router();

routes.get('/projects/:section', controller.getSection);

export default routes;