const router = require("express").Router();
const { getAllRubros, createRubro } = require("../controller/rubro.controller");
const {
  getAllComercios,
  getComercioById,
  registerComercio,
  putComercio,
} = require("../controller/comercio.controller");
const {
  getAllProductos,
  getAllProductosByComercio,
  getProductoById,
  createProducto,
  putProducto,
  deleteProducto,
} = require("../controller/producto.controller");
const {
  getAllCategorias,
  createCategoria,
} = require("../controller/categoria.controller");
const {
  getAllPedidosByComercio,
  getAllPedidosByCliente,
  getAllPedidosByRepartidor,
  getPedidosDisponibles,
  createPedido,
  updateEstadoPedido,
} = require("../controller/pedido.controller");
const {
  getAllCliente,
  getClienteById,
  registerCliente,
} = require("../controller/cliente.controller");
const { authUsuario } = require("../controller/login.controller");
const {
  registerRepartidor,
  getAllRepartidores,
  getRepartidorById,
} = require("../controller/repartidor.controller");

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
router.get("/categorias", getAllCategorias);
router.post("/crear/categoria", createCategoria);

//pedido
router.get("/pedidos-comercio/:id_comercio", getAllPedidosByComercio);
router.get("/pedidos-cliente/:id_cliente", getAllPedidosByCliente);
router.get("/pedidos-repartidor/:id_repartidor", getAllPedidosByRepartidor);
router.get("/pedidos-disponibles", getPedidosDisponibles);
router.post("/crear/pedido", createPedido);
router.put("/pedido/:id_pedido/editar", updateEstadoPedido);

//cliente
router.get("/clientes", getAllCliente);
router.get("/cliente/:id_cliente", getClienteById);
router.post("/registro-cliente", registerCliente);

//login
router.post("/login", authUsuario);

//repartidor
router.post("/registro-repartidor", registerRepartidor);
router.get("/repartidores", getAllRepartidores);
router.get("/repartidor/:id_repartidor", getRepartidorById);



module.exports = router;
