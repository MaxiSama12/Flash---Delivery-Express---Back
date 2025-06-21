const db = require("../config/db");

const authUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ mensaje: "Debe completar todos los campos" });
    }

    const queryAdmin = `SELECT * FROM comercio WHERE email_admin = ? AND pass_admin = ?`;
    const queryCliente = `SELECT * FROM cliente WHERE email = ? AND pass_cliente = ?`;
    const queryRepartidor = `SELECT * FROM repartidor WHERE email = ? AND pass_repartidor = ?`;

    db.query(queryAdmin, [email, password], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Todos los datos son obligatorios",
          error: err.message,
        });
      }

      if (result.length === 0) {
        db.query(queryCliente, [email, password], (err, result) => {
          if (err) {
            return res.status(500).json({
              mensaje: "Error al traer el cliente",
              error: err.message,
            });
          }

          if (result.length === 0) {
            db.query(queryRepartidor, [email, password], (err, result) => {
              if (err) {
                return res.status(500).json({
                  mensaje: "Error al traer el repartidor",
                  error: err.message,
                });
              }

              if (result.length === 0) {
                return res.status(401).json({
                  mensaje: "Credenciales incorrectas",
                });
              }

              return res.status(200).json({
                mensaje: "Repartidor verificado correctamente",
                repartidor: result,
              });
            });
          } else {
            return res.status(200).json({
              mensaje: "Cliente verificado correctamente",
              cliente: result,
            });
          }
        });
      } else {
        return res.status(200).json({
          mensaje: "Admin verificado correctamente",
          comercio: result,
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


module.exports = { authUsuario };