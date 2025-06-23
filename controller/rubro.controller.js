const db = require("../config/db");

const createRubro = async (req, res) => {
  try {
    const { nombre_rubro } = req.body;

    if (!nombre_rubro) {
      return res
        .status(400)
        .json({ mensaje: "El nombre del rubro es obligatorio" });
    }

    const query = "INSERT INTO rubro (nombre_rubro) VALUES (?)";

    db.query(query, [nombre_rubro], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al insertar el rubro",
          error: err.message,
        });
      }

      return res.status(201).json({
        mensaje: "Rubro creado exitosamente",
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

const getAllRubros = async (req, res) => {
  try {
    const query = "SELECT * FROM rubro";
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener los rubros",
          error: err.message,
        });
      }

      return res.status(200).json({
        mensaje: "Rubros obtenidos exitosamente",
        rubros: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = { createRubro, getAllRubros };
