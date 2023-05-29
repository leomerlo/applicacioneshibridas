import * as view from '../views/projects.view.js';
import * as projectService from '../service/projects.service.js';

function getSection(req, res) {
  const section = req.params.section;
  projectService.getProjectsBySection(section).then((projects) => {
    res.send(view.viewProjectsPage(projects, [], section));
  });
}

async function getFilteredList(req, res) {
  const section = req.params.section;
  const filteredTech = req.params.technologies.split(',').map((e) => e.charAt(0).toUpperCase() + e.slice(1));
  let technologies = [];
  await projectService.getProjectTechnologies().then((result) => {
    technologies = result;
  })
  
  const filter = {
    section,
    technologies: { $in: filteredTech }
  }
  projectService.getProjectsWithFilter(filter).then((projects) => {
    res.send(view.viewProjectsPage(projects, technologies, section));
  });
}

function getNewForm(req, res) {
  res.send(view.viewForm());
}

function saveProject(req, res) {
  const newProject = {
    name: req.body.name,
    description: req.body.description,
    link: req.body.link,
    img: req.body.img,
    section: req.body.section,
    technologies: req.body.technologies != '' ? req.body.technologies.split(',').map((e) => e.trim()) : []
  }
  projectService.saveProject(newProject).then(() => {
    res.send(view.viewForm());
  });
}

export {
  getSection,
  getFilteredList,
  getNewForm,
  saveProject
}