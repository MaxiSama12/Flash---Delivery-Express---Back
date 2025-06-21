const router = require("express").Router();
const { getAllRubros, createRubro } = require("../controller/rubro.controller")
const { getAllComercios, getComercioById, registerComercio, putComercio } = require("../controller/comercio.controller")
const { getAllProductos, getAllProductosByComercio, getProductoById, createProducto, putProducto, deleteProducto } = require("../controller/producto.controller")
const { getAllCategorias, createCategoria } = require("../controller/categoria.controller")

//rubro
router.get("/rubros", getAllRubros);
router.post("/crear/rubro", createRubro);

//comercio
router.get("/comercios", getAllComercios);
router.get("/comercio/:id_comercio", getComercioById);
router.post("/registrar/comercio", registerComercio);
router.put("/comercio/:id_comercio/editar", putComercio);

//producto
router.get("/productos", getAllProductos);
router.get("/productos/:id_comercio", getAllProductosByComercio);
router.get("/producto/:id", getProductoById);
router.post("/crear/producto", createProducto);
router.put("/producto/:id_producto/editar", putProducto);
router.delete("/producto/:id_producto/eliminar", deleteProducto);

//categoria
router.get("/categorias", getAllCategorias)
router.post("/crear/categoria", createCategoria)



//cliente


module.exports = router;