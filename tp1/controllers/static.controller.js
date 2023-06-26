import * as view from '../views/static.view.js';
import * as projectService from '../service/projects.service.js';

function getHome(req, res) {
  projectService.getAllProjects().then((projects) => {
    res.send(view.viewHomePage(projects));
  });
}

export {
  getHome
}