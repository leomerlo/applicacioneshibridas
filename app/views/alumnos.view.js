import { pageWrapper, alumnoForm } from '../utils/index.js'

function createListadoAlumnos() {
  const html = `
  <div class="container">
    <h1 class="text-center mt-5">Listado de alumnos</h1>
    <hr>
    <div class="mt-3 mb-3 d-flex justify-content-end"><a class="btn btn-primary" href="alumnos/nuevo">Agregar Nuevo Alumno</a></div>
    <hr>
    <table class="table">
      <thead>
        <tr>
          <th>Legajo</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Año</th>
          <th class="text-end">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Data</td>
          <td>Not</td>
          <td>Available</td>
          <td>Yet</td>
          <td class="text-end">
            <div class="d-flex justify-content-end">
              <a class="btn btn-primary me-2" href="/alumnos/:legajo">Ver Perfil</a>
              <a class="btn btn-primary me-2" href="/alumnos/:legajo/edit">Editar</a>
              <a class="btn btn-primary deleteUser" href="/alumnos/:legajo/delete">Eliminar</a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <a href="/" class="btn btn-secondary">Volver</a>
    </div>
  </div>
  `;
  return pageWrapper('Alumnos', html);
}

function createPerfilAlumno(alumno) {
  const html = `
  <div class="container">
    <h1 class="text-center mt-5">Perfil del alumno: ${alumno.nombre} ${alumno.apellido}</h1>
    <hr>
    <div class="d-flex justify-content-end">
    <a href="/alumnos/${alumno.legajo}/edit" class="btn btn-primary">Editar</a>
    </div>
    <hr>
    <div class="m-5">
    <div><b>Nombre:</b> ${alumno.nombre}</div>
    <div><b>Apellido:</b> ${alumno.apellido}</div>
    <div><b>Año:</b> ${alumno.ano}</div>
    </div>
    <hr>
    <div>
      <a href="/alumnos" class="btn btn-secondary">Volver</a>
    </div>
  </div>
  `;
  return pageWrapper('Perfil Alumno', html);
}

function createNewAlumnoForm() {
  const form = alumnoForm();
  const html = `
  <div class="container">
    <h1 class="text-center mt-5">Agregar nuevo alumno</h1>
    <hr class="mb-3 mt-3">
    <form action="/alumnos/nuevo" method="POST">
      ${form}
    </form>
  </div>
  `;
  return pageWrapper('Perfil Alumno', html);
}

function createEditAlumnoForm(data) {
  const form = alumnoForm(data);
  const html = `
  <div class="container">
    <h1 class="text-center mt-5">Editar alumno $Alumno</h1>
    <hr class="mb-3 mt-3">
    <form method="POST">
      ${form}
    </form>
  </div>
  `;
  return pageWrapper('Perfil Alumno', html);
}

function createDeleteForm(data) {
  const html = `
  <div class="container">
    <h1 class="text-center mt-5">Vas a eliminar al alumno ${data.nombre} ${data.apellido}. Confirma para continuar.</h1>
    <form action="" method="POST" class="text-center">
      <button class="btn btn-danger">Eliminar</button>
    </form>
  </div>`;

  return pageWrapper('Eliminar Alumno', html);
}

export {
  createListadoAlumnos,
  createPerfilAlumno,
  createNewAlumnoForm,
  createEditAlumnoForm,
  createDeleteForm
}