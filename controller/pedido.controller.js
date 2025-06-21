const db = require("../config/db");

const getAllPedidosByCliente = async (req, res) => {
  const { id_cliente } = req.params;

  try {
    const query = `
      SELECT p.*, c.nombre_comercio
      FROM pedido p
      JOIN comercio c ON p.id_comercio = c.id_comercio
      WHERE p.id_cliente = ?
      ORDER BY p.fecha_pedido DESC
    `;
    db.query(query, [id_cliente], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener los pedidos del cliente",
          error: err.message,
        });
      }

      return res.status(200).json({
        mensaje: "Pedidos del cliente obtenidos exitosamente",
        pedidos: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const getAllPedidosByComercio = async (req, res) => {
  const { id_comercio } = req.params;

  try {
    const query = `
      SELECT p.*, cl.nombre AS nombre_cliente
      FROM pedido p
      JOIN cliente cl ON p.id_cliente = cl.id_cliente
      WHERE p.id_comercio = ?
      ORDER BY p.fecha_pedido DESC
    `;
    db.query(query, [id_comercio], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener los pedidos del comercio",
          error: err.message,
        });
      }

      return res.status(200).json({
        mensaje: "Pedidos del comercio obtenidos exitosamente",
        pedidos: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const getAllPedidosByRepartidor = async (req, res) => {
  const { id_repartidor } = req.params;

  try {
    const query = `
      SELECT p.*, c.nombre_comercio
      FROM pedido p
      JOIN comercio c ON p.id_comercio = c.id_comercio
      WHERE p.id_repartidor = ?
      ORDER BY p.fecha_pedido DESC
    `;
    db.query(query, [id_repartidor], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener los pedidos del repartidor",
          error: err.message,
        });
      }

      return res.status(200).json({
        mensaje: "Pedidos del repartidor obtenidos exitosamente",
        pedidos: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const createPedido = async (req, res) => {
  try {
    const {
      fecha_pedido,
      estado,
      direccion_entrega,
      id_cliente,
      id_repartidor,
      id_comercio,
      productos, 
    } = req.body;

    if (
      !id_cliente ||
      !id_comercio ||
      !Array.isArray(productos) ||
      productos.length === 0
    ) {
      return res.status(400).json({
        mensaje: "Datos insuficientes para crear el pedido",
      });
    }

    const queryPedido = `
      INSERT INTO pedido (fecha_pedido, estado, direccion_entrega, id_cliente, id_repartidor, id_comercio)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      queryPedido,
      [
        fecha_pedido || new Date(),
        estado || "pendiente",
        direccion_entrega,
        id_cliente,
        id_repartidor || null,
        id_comercio,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            mensaje: "Error al crear el pedido",
            error: err.message,
          });
        }

        const id_pedido = result.insertId;
        const queryPedidoProducto = `
          INSERT INTO pedido_producto (id_pedido, id_producto, cantidad)
          VALUES ?
        `;

        const valores = productos.map((prod) => [
          id_pedido,
          prod.id_producto,
          prod.cantidad,
        ]);

        db.query(queryPedidoProducto, [valores], (err) => {
          if (err) {
            return res.status(500).json({
              mensaje: "Error al asociar productos al pedido",
              error: err.message,
            });
          }

          return res.status(201).json({
            mensaje: "Pedido creado exitosamente",
            id_pedido,
          });
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const updateEstadoPedido = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const { nuevo_estado, id_repartidor } = req.body;

    let query = "UPDATE pedido SET estado = ?";
    const values = [nuevo_estado];

    if (nuevo_estado === "en camino" && id_repartidor) {
      query += ", id_repartidor = ?";
      values.push(id_repartidor);
    }

    query += " WHERE id_pedido = ?";
    values.push(id_pedido);

    db.query(query, values, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ mensaje: "Error al actualizar pedido", error: err.message });
      }
      return res
        .status(200)
        .json({ mensaje: "Pedido actualizado", resultado: result });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error interno", error: error.message });
  }
};

const getPedidosDisponibles = async (req, res) => {
  try {
    const query = `
      SELECT * FROM pedido 
      WHERE estado = 'completado' AND id_repartidor IS NULL
    `;

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener los pedidos disponibles",
          error: err.message,
        });
      }

      return res.status(200).json({
        mensaje: "Pedidos disponibles obtenidos exitosamente",
        pedidos: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = {
  getAllPedidosByCliente,
  getAllPedidosByComercio,
  getAllPedidosByRepartidor,
  getPedidosDisponibles,
  createPedido,
  updateEstadoPedido,
};
