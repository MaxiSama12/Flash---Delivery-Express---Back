const router = require("express").Router();
const { getAllCliente, getClienteById, RegisterCliente } = require("../controller/cliente.controller");
const { getAllRubros, createRubro } = require("../controller/rubro.controller")

//rubro
router.get("/rubros", getAllRubros);
router.post("/crear/rubro", createRubro);

//comercio



//cliente
router.get("/clientes", getAllCliente)
router.get("/cliente/:id_cliente", getClienteById)
router.post("/registro-cliente", RegisterCliente)


module.exports = router;