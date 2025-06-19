const router = require("express").Router();
const { getAllRubros, createRubro } = require("../controller/rubro.controller")

//rubro
router.get("/rubros", getAllRubros);
router.post("/crear/rubro", createRubro);

//comercio

//cliente


module.exports = router;