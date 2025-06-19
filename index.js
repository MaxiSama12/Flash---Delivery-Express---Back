require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connection = require("./config/db");
// const router = require("./router");

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

//routes
// app.use("/", router);

//port
const port = process.env.PORT;

//connection db
// connection();

app.get('/usuarios', (req, res) => {
  connection.query('SELECT * FROM Usuario', (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).send('Error en el servidor');
    }
    res.json(results);
    console.log(results);
  });
});

app.listen(port, () => {
    console.log(`mi servidor está funcionando en el puerto ${process.env.PORT}`);
});
