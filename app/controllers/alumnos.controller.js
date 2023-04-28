import * as view from '../views/alumnos.view.js';

function getListadoAlumnos(req, res) {
  res.send(view.createListadoAlumnos());
}

function getAlumnoByLegajo(req, res) {
  const data = {
    legajo: '0',
    nombre: 'Leo',
    apellido: 'Merlo',
    ano: '2015'
  }
  res.send(view.createPerfilAlumno(data));
}

function getAlumnoEditForm(req, res) {
  const data = {
    legajo: '0',
    nombre: 'Leo',
    apellido: 'Merlo',
    ano: '2015'
  }
  res.send(view.createEditAlumnoForm(data));
}

function getAlumnoNewForm(req, res) {
  res.send(view.createNewAlumnoForm());
}

function editAlumno(req, res) {
  res.redirect('../../alumnos');
}

function saveAlumno(req, res) {
  res.redirect('../alumnos');
}

function deleteAlumnoForm(req, res) {
  const data = {
    legajo: '0',
    nombre: 'Leo',
    apellido: 'Merlo',
    ano: '2015'
  }
  res.send(view.createDeleteForm(data));
}

function deleteAlumno(req, res) {
  res.redirect('/alumnos');
}

export {
  getListadoAlumnos,
  getAlumnoByLegajo,
  getAlumnoEditForm,
  getAlumnoNewForm,
  saveAlumno,
  editAlumno,
  deleteAlumnoForm,
  deleteAlumno
}