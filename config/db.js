const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.HOST,  
  port: process.env.PORT,     
  user: process.env.USER_DB,       
  password: process.env.PASS_DB,
  database: process.env.NAME_DB
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos MySQL exitosa!');
});

module.exports = connection;
