const db = require("../config/db");

const createPedidoProducto = async (req, res) => {
  try {
    const { id_pedido, id_producto, cantidad } = req.body;

    if (!id_pedido || !id_producto || !cantidad) {
      return res.status(400).json({ mensaje: "Faltan datos para registrar el producto del pedido" });
    }

    const query = `
      INSERT INTO pedido_producto (id_pedido, id_producto, cantidad)
      VALUES (?, ?, ?)
    `;

    db.query(query, [id_pedido, id_producto, cantidad], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al insertar producto en el pedido",
          error: err.message,
        });
      }

      return res.status(201).json({
        mensaje: "Producto agregado al pedido",
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = { createPedidoProducto };
