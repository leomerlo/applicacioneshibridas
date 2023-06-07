import * as view from '../views/projects.view.js';
import * as projectService from '../service/projects.service.js';
import * as clientsService from '../service/clients.service.js';

function getAllProjects(req, res) {
  projectService.getProjectTechnologies().then((technologies) => {
    projectService.getAllProjects().then((projects) => {
      res.send(view.viewProjectsPage(projects, technologies));
    });
  })
}

function getSection(req, res) {
  const section = req.params.section;
  projectService.getProjectTechnologies().then((technologies) => {
    projectService.getProjectsBySection(section).then((projects) => {
      res.send(view.viewProjectsPage(projects, technologies, section));
    });
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
  clientsService.getAllClients().then((clients) => {
    res.send(view.viewForm({}, clients));
  });
}

function saveProject(req, res) {
  let message = {};

  if(
    req.body.name === '' ||
    req.body.description === '' ||
    req.body.link === '' ||
    req.body.img === '' ||
    req.body.section === '' ||
    req.body.technologies === ''
  ) {
    message = {
      variant: 'danger',
      text: "Todos los campos son requeridos para crear un proyecto.",
    };
    clientsService.getAllClients().then((clients) => {
      res.send(view.viewForm(req.body, clients, message));
    });
  }

  const newProject = {
    name: req.body.name,
    client_id: req.body.client_id,
    description: req.body.description,
    link: req.body.link,
    img: req.body.img,
    section: req.body.section,
    technologies: req.body.technologies != '' ? req.body.technologies.split(',').map((e) => e.trim()) : []
  }
  
  projectService.saveProject(newProject).then((project) => {
    message = {
      variant: 'success',
      text: `El proyecto ${project.name} fue creado con éxito`,
    };
    clientsService.getAllClients().then((clients) => {
      res.send(view.viewForm({}, clients));
    });
  }).catch((error) => {
    message = {
      variant: 'danger',
      text: `Hubo un problema al crear el proyecto, intentelo nuevamente.`,
    };
    clientsService.getAllClients().then((clients) => {
      res.send(view.viewForm({}, clients, message));
    });
  });
}

function getEditForm(req, res) {
  projectService.getProjectById(req.params.id).then((project) => {
    clientsService.getAllClients().then((clients) => {
      res.send(view.viewForm(project, clients));
    });
  });
}

function editProject(req, res) {
  let message = {};

  if(
    req.body.name === '' ||
    req.body.client_id === '' ||
    req.body.description === '' ||
    req.body.link === '' ||
    req.body.img === '' ||
    req.body.section === '' ||
    req.body.technologies === ''
  ) {
    message = {
      variant: 'danger',
      text: "Todos los campos son requeridos para crear un proyecto.",
    };
    clientsService.getAllClients().then((clients) => {
      res.send(view.viewForm(req.body, clients, message));
    });
  }

  const project = {
    id: req.params.id,
    name: req.body.name,
    client_id: req.body.client_id,
    description: req.body.description,
    link: req.body.link,
    img: req.body.img,
    section: req.body.section,
    technologies: req.body.technologies != '' ? req.body.technologies.split(',').map((e) => e.trim()) : []
  }

  projectService.updateProject(project).then(() => {
    if (project) {
      message = {
        variant: 'success',
        text: 'El proyecto fue editado con éxito',
      };
    }
    else {
      message = {
        variant: 'danger',
        text: 'No se encontró el proyecto',
      };
    }
    clientsService.getAllClients().then((clients) => {
      res.send(view.viewForm(project, clients, message));
    });
  });
}

function getDeleteConfirm(req, res) {
  projectService.getProjectById(req.params.id).then((project) => {
    res.send(view.confirmDelete(project));
  });
}

function deleteProject(req, res) {
  projectService.removeProject(req.params.id).then(() => {
    res.redirect('/');
  });
}

export {
  getAllProjects,
  getSection,
  getFilteredList,
  getNewForm,
  saveProject,
  getEditForm,
  editProject,
  getDeleteConfirm,
  deleteProject
}