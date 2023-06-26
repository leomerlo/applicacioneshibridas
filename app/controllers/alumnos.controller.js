import * as service from '../services/alumnos.service.js';
import * as view from '../views/alumnos.view.js';

function getListadoAlumnos(req, res) {
  service.getAlumnos().then((alumnos) => {
    res.send(view.createListadoAlumnos(alumnos));
  });
}

function getListadoAlumnosEliminados(req, res) {
  service.getAlumnosEliminados().then((alumnos) => {
    console.log(alumnos)
    res.send(view.createListadoAlumnos(alumnos, true));
  });
}

function getAlumnoByLegajo(req, res) {
  service.getAlumnosByLegajo(req.params.legajo).then((alumno) => {
    if(alumno) {
      res.send(view.createPerfilAlumno(alumno));
    } else {
      res.send(view.createAlumnoInexistente());
    }
  });
}

function getAlumnoEditForm(req, res) {
  service.getAlumnosByLegajo(req.params.legajo).then((alumno) => {
    if(alumno) {
      res.send(view.createEditAlumnoForm(alumno));
    } else {
      res.send(view.createAlumnoInexistente());
    }
  });
}

function getAlumnoNewForm(req, res) {
  res.send(view.createNewAlumnoForm());
}

function editAlumno(req, res) {
  const alumno = {
    legajo: req.body.legajo,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    ano: req.body.ano
  }
  service.getAlumnosByLegajo(alumno.legajo).then((alumno) => {
    if(alumno) {
      service.updateAlumno(alumno).then(() => {
        res.redirect('/alumnos');
      });
    } else {
      res.send(view.createAlumnoInexistente());
    }
  });
}

function saveAlumno(req, res) {
  const alumno = {
    legajo: req.body.legajo,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    ano: req.body.ano
  }
  service.createAlumno(alumno).then(() => {
    res.redirect('../alumnos');
  });
}

function deleteAlumnoForm(req, res) {
  service.getAlumnosByLegajo(req.params.legajo).then((alumno) => {
    if(alumno) {
      res.send(view.createDeleteForm(alumno));
    } else {
      res.send(view.createAlumnoInexistente());
    }
  });
}

function deleteAlumno(req, res) {
  service.getAlumnosByLegajo(req.params.legajo).then((alumno) => {
    if(alumno) {
      alumno.deleted = true;
      service.updateAlumno(alumno).then((alumno) => {
        res.redirect('/alumnos');
      });
    } else {
      res.send(view.createAlumnoInexistente());
    }
  });
}

function restoreAlumno(req, res) {
  service.getAlumnosByLegajo(req.params.legajo, true).then((alumno) => {
    if(alumno) {
      alumno.deleted = false;
      service.updateAlumno(alumno).then((alumno) => {
        res.redirect('/alumnos');
      });
    } else {
      res.send(view.createAlumnoInexistente());
    }
  });
}

export {
  getListadoAlumnos,
  getAlumnoByLegajo,
  getAlumnoEditForm,
  getAlumnoNewForm,
  saveAlumno,
  editAlumno,
  deleteAlumnoForm,
  deleteAlumno,
  getListadoAlumnosEliminados,
  restoreAlumno
}