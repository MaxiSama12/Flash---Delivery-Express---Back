const db = require("../config/db");

const createCategoria = async (req, res) => {
  try {
    const { nombre_categoria } = req.body;

    if (!nombre_categoria) {
      return res
        .status(400)
        .json({ mensaje: "El nombre de la categoria es obligatorio" });
    }

    const query = "INSERT INTO categoria (nombre) VALUES (?)";

    db.query(query, [nombre_categoria], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al insertar el rubro",
          error: err.message,
        });
      }

      return res.status(201).json({
        mensaje: "Categoria creada exitosamente",
        resultado: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const getAllCategorias = async (req, res) => {
  try {
    const query = "SELECT * FROM categoria ORDER BY nombre ASC";
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener las categorias",
          error: err.message,
        });
      }

      return res.status(200).json({
        mensaje: "Categorias obtenidas exitosamente",
        categorias: result,
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
    getAllCategorias,
    createCategoria
}