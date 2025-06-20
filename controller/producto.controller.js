const db = require("../config/db");

const getAllProductos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const query = `SELECT * FROM producto LIMIT ? OFFSET ?`;
    db.query(query, [limit, offset], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener los productos",
          error: err.message,
        });
      }

      return res.status(200).json({
        mensaje: "Productos obtenidos exitosamente",
        page,
        limit,
        productos: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const getAllProductosByComercio = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(500).json({
        mensaje: "El comercio no fue encontrado",
      });
    }
    const query = `SELECT * FROM producto WHERE id_comercio = ?`;
    db.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener los productos del comercio",
          error: err.message,
        });
      }

      return res.status(200).json({
        mensaje: "Productos del comercio obtenidos exitosamente",
        productos: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const getProductoById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(500).json({
      mensaje: "No existe el producto",
    });
  }
  const query = `SELECT * FROM producto WHERE id_producto = ?`;
  db.query(query, [id], (err, result) => {
    if (result.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    if (err) {
      return res.status(500).json({
        mensaje: "Error al encontrar el producto",
      });
    }
    return res.status(200).json({
      mensaje: "Producto encontrado exitosamente",
      producto: result,
    });
  });
};

module.exports = {
  getAllProductos,
  getAllProductosByComercio,
  getProductoById,
};
