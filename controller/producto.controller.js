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
  try {
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
          error: err,
        });
      }
      return res.status(200).json({
        mensaje: "Producto encontrado exitosamente",
        producto: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const createProducto = async (req, res) => {
  const {
    nombre,
    descripcion,
    precio,
    rating,
    disponible,
    id_comercio,
    id_categoria,
    url_imagen,
  } = req.body;

  try {
    if (!nombre || !precio || !id_comercio || !id_categoria || !url_imagen) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios",
      });
    }
    const query = `INSERT INTO producto (
    nombre,
    descripcion,
    precio,
    rating,
    disponible,
    id_comercio,
    id_categoria,
    url_imagen,
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(
      query,
      [
        nombre,
        descripcion,
        precio,
        rating,
        disponible,
        id_comercio,
        id_categoria,
        url_imagen,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            mensaje: "Error al crear el producto",
            error: err,
          });
        }
        return res.status(201).json({
          mensaje: "Producto creado exitosamente",
          idProducto: result.insertId,
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

const putProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;
    const {
      nombre,
      descripcion,
      precio,
      rating,
      disponible,
      id_comercio,
      id_categoria,
      url_imagen,
    } = req.body;

    if (!id_producto) {
      return res
        .status(400)
        .json({ mensaje: "ID de producto no proporcionado" });
    }

    const query = `
      UPDATE producto 
      SET nombre = ?, descripcion = ?, precio = ?, rating = ?, disponible = ?, 
          id_comercio = ?, id_categoria = ?, url_imagen = ?
      WHERE id_producto = ?
    `;

    db.query(
      query,
      [
        nombre,
        descripcion,
        precio,
        rating,
        disponible,
        id_comercio,
        id_categoria,
        url_imagen,
        id_producto,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            mensaje: "Error al editar el producto",
            error: err.message,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        return res.status(200).json({
          mensaje: "Producto editado exitosamente",
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

const deleteProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    if (!id_producto) {
      return res
        .status(400)
        .json({ mensaje: "ID de producto no proporcionado" });
    }

    const query = `DELETE FROM producto WHERE id_producto = ?`;

    db.query(query, [id_producto], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al eliminar el producto",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
      }

      return res.status(200).json({
        mensaje: "Producto eliminado exitosamente",
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
  getAllProductos,
  getAllProductosByComercio,
  getProductoById,
  createProducto,
  putProducto,
  deleteProducto,
};
