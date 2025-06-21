const db = require("../config/db");

const getAllCliente = async (req, res) => {
  try {
    const query = "SELECT * FROM cliente";

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener los clientes",
          error: err.message,
        });
      }
      return res.status(200).json({
        mensaje: "Clientes obtenidos correctamente",
        usuarios: result,
      });
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const getClienteById = async (req, res) => {
  try {
    const { id_cliente } = req.params;

    if (!id_cliente) {
      return res
        .status(400)
        .json({ mensaje: "El id del cliente es obligatorio" });
    }

    const query = "SELECT * FROM cliente WHERE id_cliente = ?";

    db.query(query, [id_cliente], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al traer el cliente",
          error: err.message,
        });
      }

      return res.status(201).json({
        mensaje: "Cliente traido exitosamente",
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

const registerCliente = async (req, res) => {
  try {
    const { nombre, email, telefono, direccion, pass_cliente, rol } = req.body;

    if (!nombre || !email || !telefono || !direccion || !pass_cliente || !rol) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    const queryClienteEmail = "SELECT email FROM cliente WHERE email = ?";

    db.query(queryClienteEmail, [email], (err, result) => {
      if (err) {
        return res.status(500).json({
          mensaje: "Error al obtener los emails",
          error: err.message,
        });
      }

      if (result.length === 0) {
        const query =
          "INSERT INTO cliente(nombre, email, telefono, direccion, pass_cliente, rol) VALUES( ?, ?, ?, ?, ?, ?)";
        db.query(
          query,
          [nombre, email, telefono, direccion, pass_cliente, rol],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                mensaje: "error al insertar cliente",
                error: err.message,
              });
            }

            return res.status(201).json({
              mensaje: "El cliente se registro correctamente.",
              resultado: result,
            });
          }
        );
      } else {
        return res.status(409).json({
          mensaje: "El email ya está registrado",
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

module.exports = { getAllCliente, getClienteById, registerCliente };
