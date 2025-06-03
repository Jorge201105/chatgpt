const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Crear base de datos
const db = new sqlite3.Database('clientes.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err.message);
  }
});

// Crear tabla si no existe
const createTableQuery = `CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project TEXT NOT NULL
)`;
db.run(createTableQuery);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  const { name, email, phone, project } = req.body;
  const stmt = db.prepare('INSERT INTO clientes (name, email, phone, project) VALUES (?, ?, ?, ?)');
  stmt.run(name, email, phone, project, function (err) {
    if (err) {
      console.error('Error al insertar datos', err.message);
      res.status(500).send('Error al guardar los datos');
    } else {
      res.send('Datos guardados correctamente');
    }
  });
  stmt.finalize();
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
