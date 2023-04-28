import { pageWrapper } from '../utils/index.js'

function createHomePage() {
  const html = `
  <div class="container">
    <h1 class="text-center mt-5">Administración de Almunos</h1>
    <ul><li><a href="/alumnos">Ver Lista de alumnos</a></li></ul>
  </div>
  `;
  return pageWrapper('Home', html);
}

export {
  createHomePage
}