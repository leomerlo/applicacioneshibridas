const http = require('node:http');

const productos = [
  { 
    id: 1,
    name: "Espresso",
    price: 2.5
  },
  {
    id: 2,
    name: "Café con leche",
    price: 3.5
  },
  {
    id: 3,
    name: "Cappuccino",
    price: 3.0
  },
  {
    id: 4,
    name: "Mocha",
    price: 4.0
  },
  {
    id: 5,
    name: "Latte",
    price: 3.5
  }
];

// reponse.write() - Escribe en el body un mensaje de respuesta

const server = http.createServer(function(req, res) {

  res.write('<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body>');

  res.write('<h1>Mi espectacular Pagina web</h1>');
  
  if(req.url === '/'){
    res.write('<p>Leo Merlo</p>');
  } else if(req.url === '/materia') {
    res.write('<p>Applicaciones hibridas</p>');
  } else if(req.url === '/profesor') {
    res.write('<p>Lic. Brian Lara</p>');
  } else if(req.url === '/productos') {
    res.write('<ul>');
    productos.forEach((e) => {
      res.write(`<li><span>${e.name}</span></li>`);
    });
    res.write('</ul>');
  } else {
    res.write('<p>404 Not found</p>');
  }

  res.write('</body></html>')

  res.end();

});

server.listen(2022);