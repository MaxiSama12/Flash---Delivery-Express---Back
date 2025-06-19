require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./router");

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

//routes
app.use("/", router);

//port
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`mi servidor está funcionando en el puerto ${port}`);
});
