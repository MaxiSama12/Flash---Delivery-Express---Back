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

const getAllPedidosByComercio = (req, res) => {
  const { id_comercio } = req.params;

  const query = `
    SELECT 
      p.id_pedido,
      p.fecha_pedido,
      p.estado,
      p.direccion_entrega,
      p.id_cliente,
      cl.nombre AS nombre_cliente,
      pp.id_producto,
      pr.nombre AS nombre_producto,
      pr.precio,
      pp.cantidad
    FROM pedido p
    JOIN cliente cl ON p.id_cliente = cl.id_cliente
    JOIN pedido_producto pp ON p.id_pedido = pp.id_pedido
    JOIN producto pr ON pp.id_producto = pr.id_producto
    WHERE p.id_comercio = ?
    ORDER BY p.fecha_pedido DESC
  `;

  db.query(query, [id_comercio], (err, results) => {
    if (err) {
      return res.status(500).json({
        mensaje: "Error al obtener los pedidos",
        error: err.message,
      });
    }

    // Agrupar los productos por pedido
    const pedidosMap = new Map();

    results.forEach((row) => {
      if (!pedidosMap.has(row.id_pedido)) {
        pedidosMap.set(row.id_pedido, {
          id_pedido: row.id_pedido,
          fecha_pedido: row.fecha_pedido,
          estado: row.estado,
          direccion_entrega: row.direccion_entrega,
          id_cliente: row.id_cliente,
          nombre_cliente: row.nombre_cliente,
          productos: [],
        });
      }

      const pedido = pedidosMap.get(row.id_pedido);
      pedido.productos.push({
        id_producto: row.id_producto,
        nombre: row.nombre_producto,
        cantidad: row.cantidad,
        precio: row.precio,
      });
    });

    const pedidos = Array.from(pedidosMap.values());

    return res.status(200).json({ pedidos });
  });
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

        console.log("valores", valores);

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

const getPedidosDisponibles = (req, res) => {
  const query = `
    SELECT
      p.id_pedido,
      p.fecha_pedido,
      p.estado,
      p.direccion_entrega,
      p.id_cliente,
      cl.nombre AS nombre_cliente,
      p.id_comercio,
      c.nombre_comercio,
      c.direccion
    FROM pedido p
    JOIN cliente cl ON p.id_cliente = cl.id_cliente
    JOIN comercio c ON p.id_comercio = c.id_comercio
    WHERE p.estado = 'completado' AND p.id_repartidor IS NULL
    ORDER BY p.fecha_pedido DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        mensaje: "Error al obtener pedidos disponibles",
        error: err.message,
      });
    }
    return res.status(200).json({
      mensaje: "Pedidos disponibles",
      pedidos: results,
    });
  });
};

module.exports = {
  getAllPedidosByCliente,
  getAllPedidosByComercio,
  getAllPedidosByRepartidor,
  getPedidosDisponibles,
  createPedido,
  updateEstadoPedido,
};
