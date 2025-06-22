# 🛠️ Flash Delivery Express – Backend

Este repositorio contiene el backend de una plataforma multirubro tipo *PedidosYa*, desarrollado en Node.js y Express. Provee una API para autenticación, registro de usuarios, registro de comercios, productos, pedidos y repartidores.

---

## ⚙️ Tecnologías utilizadas

- Node.js
- Express
- MySQL
- CORS
- Morgan
- Dotenv

---

## 🚀 Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/usuario/repositorio-backend.git
cd Flash---Delivery-Express---Back
```
2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno
   
Crear un archivo .env con la estructura:
```bash
PORT=
HOST=
USER_DB=
PASS_DB=
NAME_DB=
```

4. Iniciar el servidor
```bash
npm run dev
```
---
## 🧱 Estructura del proyecto

```bash
backend/
├── config/            → Configuración DB, dotenv, etc.
├── controller/        → Lógica de negocio por recurso
├── router/            → Rutas Express agrupadas por recurso
├── index.js           → Entrada principal
```
---

## 🧠 Funcionalidades principales
Registro e inicio de sesión por rol (cliente, comercio, repartidor)

- CRUD de productos (por comercio)

- Gestión de pedidos

- Asignación de repartidores

- Seguimiento de estado del pedido
 ---
 
## 🗂️ Rutas principales
![image](https://github.com/user-attachments/assets/e9c9bc4a-a768-47a1-9d3f-5749c5a57185)
---

## 🗃️ Base de datos
Script SQL: database/schema.sql

Diagrama ER (entidad-relación) en docs/diagram.png

Tablas: cliente, comercio, producto, pedido, detalle_pedido, repartidor, rutas_entrega, categoria

##🧑‍💻 Autor
Desarrollado por: 
- Samaniego Esteban
- Giacobbe Dario
- Timo Hector
- Morales Juan
- Ponce Micaela
- Ruiz Pablo

Proyecto académico / personal
