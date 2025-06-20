const router = require("express").Router();
const { getAllRubros, createRubro } = require("../controller/rubro.controller")
const { getAllComercios, getComercioById, registerComercio, putComercio } = require("../controller/comercio.controller")

//rubro
router.get("/rubros", getAllRubros);
router.post("/crear/rubro", createRubro);

//comercio
router.get("/comercios", getAllComercios);
router.get("/comercio/:id_comercio", getComercioById);
router.post("/registrar/comercio", registerComercio);
router.put("/comercio/:id_comercio/editar", putComercio);



//cliente


module.exports = router;