const db = require("../config/db");

const getAllRepartidores = async (req, res) => {
  try {
    const query = "SELECT * FROM repartidor";

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error trayendo los repartidores.",
          error: err.message,
        });
      }

      return res.status(200).json({
        mensaje: "Repartidores traidos correctamente.",
        repartidores: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor.",
      error: error.message,
    });
  }
};

const getRepartidorById = async (req, res) => {
  try {
    const { id_repartidor } = req.params;

    if (!id_repartidor) {
      return res.status(400).json({
        mensaje: "El id es necesario",
      });
    }

    const query = "SELECT * FROM repartidor WHERE id_repartidor = ?";

    db.query(query, [id_repartidor], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al traer el repartidor",
          error: err.message,
        });
      }

      return res.status(201).json({
        mensaje: "Repartidor traido exitosamente",
        resultado: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor.",
      error: error.message,
    });
  }
};

const registerRepartidor = async (req, res) => {
  try {
    const { nombre, telefono, email, vehiculo, activo, pass_repartidor, rol } =
      req.body;

    if (
      !nombre ||
      !telefono ||
      !email ||
      !vehiculo ||
      !pass_repartidor ||
      !rol
    ) {
      return res.status(400).json({
        mensaje: "Deben completarse todos los campos",
      });
    }

    const query = "SELECT email FROM repartidor WHERE email = ?";
    db.query(query, [email], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener los emails",
          error: err.message,
        });
      }

      if (result.length === 0) {
        const query =
          "INSERT INTO repartidor(nombre, telefono, email, vehiculo, rol, pass_repartidor) VALUES( ?, ?, ?, ?, ?, ?)";
        db.query(
          query,
          [nombre, telefono, email, vehiculo, rol, pass_repartidor],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                mensaje: "error al insertar repartidor",
                error: err.message,
              });
            }

            return res.status(201).json({
              mensaje: "El repartidor se registró correctamente.",
              resultado: result,
            });
          }
        );
      } else {
        return res.status(409).json({
          mensaje: "Este email ya está registrado",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

module.exports = { getAllRepartidores, getRepartidorById, registerRepartidor };
