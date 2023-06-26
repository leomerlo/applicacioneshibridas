function pageWrapper(title, content) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <title>${title}</title>
      </head>
      <body>${content}</body>
      <script src="js/bootstrap.bundle.min.js"></script>
    </html>
  `;

  return html
}

function alumnoForm(data = { legajo: '', nombre: '', apellido: '', ano: ''}) {
  let html;

  html += `<div class="d-flex justify-content-end">
    <button class="btn btn-primary">Guardar</button>
  </div>
  <hr class="mb-3 mt-3">`;

  html += '<div class="mb-3">';
  html += '<label for="legajo" class="form-label">Legajo</label>';
  if(data.legajo != '') {
    html += `
      <input readonly class="form-control" type="text" name="legajo" id="legajo" value="${data.legajo}"/>
    `;
  } else {
    html += `
      <input type="text" class="form-control" name="legajo" id="legajo"/>
    `;
  }
  html += '</div>';

  html += `
    <div class="mb-3">
      <label for="nombre" class="form-label">Nombre</label>
      <input type="text" class="form-control" id="nombre" name="nombre" required value="${data.nombre}"/>
    </div>
    <div class="mb-3">
      <label for="apellido" class="form-label">Apellido</label>
      <input type="text" class="form-control" id="apellido" name="apellido" required value="${data.apellido}" />
    </div>
    <div class="mb-3">
      <label for="ano" class="form-label">Año</label>
      <input type="text" class="form-control" id="ano" name="ano" required pattern="[0-9]{4}" placeholder="Año con 4 digitos" value="${data.ano}" />
    </div>
    <hr class="mb-3 mt-3">
    <div class="d-flex justify-content-between">
      <a href="/alumnos" class="btn btn-secondary">Cancelar</a>
    </div>
  `;

  return html;
}

export {
  pageWrapper,
  alumnoForm
}