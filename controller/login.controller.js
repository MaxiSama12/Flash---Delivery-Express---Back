const db = require("../config/db");

const authUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ mensaje: "Debe completar todos los campos" });
    }

    const query1 = `SELECT * FROM comercio WHERE email_admin = ? AND pass_admin = ?`;
    const query2 = `SELECT * FROM cliente WHERE email = ? AND pass_cliente = ?`;
    const query3 = `SELECT * FROM repartidor WHERE email = ? AND pass_repartidor = ?`;

    db.query(query1, [email, password], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al traer",
          error: err.message,
        });
      }

      if (result.length === 0) {
        db.query(query2, [email, password], (err, result) => {
          if (err) {
            return res.status(500).json({
              mensaje: "Error al traer",
              error: err.message,
            });
          }

          if (result.length === 0) {
            db.query(query3, [email, password], (err, result) => {
              if (err) {
                return res.status(500).json({
                  mensaje: "Error al traer",
                  error: err.message,
                });
              }

              if (result.length === 0) {
                return res.status(401).json({
                  mensaje: "Credenciales incorrectas",
                });
              }

              return res.status(200).json({
                mensaje: "Cuenta verificada correctamente",
                repartidor: result,
              });
            });
          } else {
            return res.status(200).json({
              mensaje: "Cuenta verificada correctamente",
              cliente: result,
            });
          }
        });
      } else {
        return res.status(200).json({
          mensaje: "Cuenta verificada correctamente",
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