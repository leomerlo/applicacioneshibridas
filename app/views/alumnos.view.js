import { pageWrapper, alumnoForm } from '../utils/index.js'

function createListadoAlumnos(alumnos, eliminados = false) {
  let listadoAlumnos = '';

  const title = eliminados ? "Listado de alumnos eliminados" : "Listado de alumnos"

  const botones = eliminados ? `
    <a class="btn btn-secondary me-2" href="/alumnos/">Ver Alumnos Enlistados</a>
  ` : `
    <a class="btn btn-secondary me-2" href="/alumnos/eliminados">Ver Alumnos Eliminados</a>
    <a class="btn btn-primary" href="/alumnos/nuevo">Agregar Nuevo Alumno</a>
  `;

  if(alumnos.length > 0) {
    alumnos.forEach(alumno => {
      const acciones = eliminados ? `
      <a class="btn btn-primary me-2" href="/alumnos/${alumno.legajo}/restore">Restaurar</a>
      ` : `
      <a class="btn btn-primary me-2" href="/alumnos/${alumno.legajo}">Ver Perfil</a>
      <a class="btn btn-primary me-2" href="/alumnos/${alumno.legajo}/edit">Editar</a>
      <a class="btn btn-primary deleteUser" href="/alumnos/${alumno.legajo}/delete">Eliminar</a>
      `;
      listadoAlumnos += `
        <tr>
          <td>${alumno.legajo}</td>
          <td>${alumno.nombre}</td>
          <td>${alumno.apellido}</td>
          <td>${alumno.ano}</td>
          <td class="text-end">
            <div class="d-flex justify-content-end">
              ${acciones}
            </div>
          </td>
        </tr>`
    });
  } else {
    listadoAlumnos = '<td colspan="5" class="text-center">No existen alumnos en nuestros registros. Podés crear uno para comenzar.</td>'
  }

  const html = `
  <div class="container">
    <h1 class="text-center mt-5">${title}</h1>
    <hr>
    <div class="mt-3 mb-3 d-flex justify-content-end">
      ${botones}
    </div>
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
        ${listadoAlumnos}
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
    <h1 class="text-center mt-5">Editando alumno - ${data.nombre} ${data.apellido}</h1>
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

function createAlumnoInexistente() {
  const html = `
  <div class="container">
    <div class="text-center">
      <h1 class="mt-5">El alumno que estas buscando no existe o fue eliminado.</h1>
      <a href="/alumnos">Volver al listado</a>
    </div>
  </div>`;

  return pageWrapper('Eliminar Alumno', html);
}

export {
  createListadoAlumnos,
  createPerfilAlumno,
  createNewAlumnoForm,
  createEditAlumnoForm,
  createDeleteForm,
  createAlumnoInexistente
}