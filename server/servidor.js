const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config({ path: '/app/.env' });
// require('dotenv').config();


const app = express();
app.use(cors());
app.use(bodyParser.json());


const connection = mysql.createConnection({
    host:  process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  
});

connection.connect((error) => {
  if (error) {
    console.log("Error de conexión a MySQL:", error);
  } else {
    console.log("Conexión exitosa a MySQL");
  }
});

 app.get("/api/users", (req, res) => {

   const sql = "SELECT * FROM users";
   connection.query(sql, (error, results) => {
     if (error) {
       res.status(500).json({ error });
     } else {
       res.status(200).json({ users: results });
     }
   });
 });


app.get("/api/users/:id", (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  const values = [req.params.id];
  connection.query(sql, values, (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
    } else {
      res.status(200).json({ user: results[0] });
    }
  });
});

app.post("/api/users", (req, res) => {
  const sql = "INSERT INTO users (id, name, email, password) VALUES (DEFAULT, ?, ?, ?)";
  const values = [req.body.name, req.body.email, req.body.password];
  connection.query(sql, values, (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.status(201).json({ message: "Usuario creado exitosamente" });
    }
  });
});

app.put("/api/users/:id", (req, res) => {
  const sql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
  const values = [
    req.body.name,
    req.body.email,
    req.body.password,
    req.params.id,
  ];
  connection.query(sql, values, (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
    } else {
      res.status(200).json({ message: "Usuario actualizado exitosamente" });
    }
  });
});

app.delete("/api/users/:id", (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  const values = [req.params.id];
  connection.query(sql, values, (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Usuario no encontrado" });
    } else {
      res.status(200).json({ message: "Usuario eliminado exitosamente" });
    }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});