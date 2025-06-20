const db = require("../config/db");

const getAllComercios = async (req, res) => {
  try {
    const query =
      "SELECT c.*, r.nombre_rubro FROM comercio c JOIN rubro r ON c.id_rubro = r.id_rubro";
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener los comercios",
          error: err.message,
        });
      }

      return res.status(200).json({
        mensaje: "Comercios obtenidos exitosamente",
        comercios: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const registerComercio = async (req, res) => {
  const {
    id_rubro,
    nombre_comercio,
    direccion,
    telefono,
    activo,
    url_imagen,
    rating,
    demora_promedio,
    nombre_admin,
    email_admin,
    pass_admin,
  } = req.body;

  try {
    if (
      !id_rubro ||
      !nombre_comercio ||
      !url_imagen ||
      !nombre_admin ||
      !email_admin ||
      !pass_admin
    ) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    const query = `
      INSERT INTO comercio (
        id_rubro,
        nombre_comercio,
        direccion,
        telefono,
        activo,
        url_imagen,
        rating,
        demora_promedio,
        nombre_admin,
        email_admin,
        pass_admin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        id_rubro,
        nombre_comercio,
        direccion,
        telefono,
        1,
        url_imagen,
        rating,
        demora_promedio,
        nombre_admin,
        email_admin,
        pass_admin,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            mensaje: "Error al insertar el comercio",
            error: err.message,
          });
        }
        return res.status(201).json({
          mensaje: "Comercio creado exitosamente",
          resultado: result.insertId,
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

const getComercioById = async (req, res) => {
  try {
    const { id_comercio } = req.parms;
    const query = `
    SELECT c.*, r.nombre_rubro FROM comercio c
    JOIN rubro r ON c.id_rubro = r.id_rubro
    WHERE c.id_comercio = ?`;
    db.query(query, [id_comercio], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener los comercios",
          error: err.message,
        });
      }
      if (result.length === 0) {
        return res.status(404).json({ mensaje: "Comercio no encontrado" });
      }

      return res.status(200).json({
        mensaje: "Comercio obtenido exitosamente",
        comercio: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const putComercio = async (req, res) => {
  try {
    const { id_comercio } = req.params;

    const query1 = "SELECT activo FROM comercio WHERE id_comercio = ?";
    db.query(query1, [id_comercio], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener el comercio",
          error: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({ mensaje: "Comercio no encontrado" });
      }

      const activoActual = result[0].activo;
      const nuevoEstado = !activoActual;

      const query2 = "UPDATE comercio SET activo = ? WHERE id_comercio = ?";
      db.query(query2, [nuevoEstado, id_comercio], (err, result) => {
        if (err) {
          return res.status(500).json({
            mensaje: "Error al actualizar el estado del comercio",
            error: err.message,
          });
        }

        return res.status(200).json({
          mensaje: nuevoEstado ? "Comercio activado" : "Comercio desactivado",
          resultado: result,
        });
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
  getAllComercios,
  registerComercio,
  getComercioById,
  putComercio,
};
