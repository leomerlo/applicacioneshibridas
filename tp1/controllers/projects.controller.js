import * as view from '../views/projects.view.js';
import * as projectService from '../service/projects.service.js';

function getSection(req, res) {
  const section = req.params.section;
  projectService.getProjectsBySection(section).then((projects) => {
    res.send(view.viewProjectsPage(projects, section));
  });
}

export {
  getSection
}