const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/imagenes_producto/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Configuración de la base de datos
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
};

// Conexión a la base de datos
sql
  .connect(config)
  .then((pool) => {
    if (pool.connecting) console.log("Conectando a la base de datos...");
    if (pool.connected) console.log("Conectado a la base de datos.");
  })
  .catch((err) => {
    console.error(
      "¡Falló la conexión a la base de datos! Configuración incorrecta:",
      err
    );
    process.exit(1);
  });

// Función para manejar errores
const handleError = (res, message, err) => {
  console.error(`${message}:`, err);
  res
    .status(500)
    .json({ success: false, message: `${message}: ${err.message}` });
};

// Endpoints de Productos
app.get("/api/productos", async (req, res) => {
  try {
    const result = await sql.query`EXEC ObtenerProductos`;
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Error en la consulta de productos", err);
  }
});

app.get("/api/productos/categoria/:categoria", async (req, res) => {
  const { categoria } = req.params;
  try {
    const result = await sql.query`
      EXEC ObtenerProductosPorCategoria @Categoria = ${categoria}
    `;
    res.json(result.recordset);
  } catch (err) {
    handleError(res, "Error en la consulta de productos por categoría", err);
  }
});

//Endpoint para Obtener Producto e Imagenes//
app.get("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.query`
      EXEC ObtenerProductoEImagenes @Id_producto = ${id}
    `;
    const resultProducto = result.recordsets[0];
    const resultImagenes = result.recordsets[1];
    if (resultProducto.length > 0) {
      res.json({
        ...resultProducto[0],
        imagenes: resultImagenes,
      });
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (err) {
    handleError(res, "Error en la consulta del producto", err);
  }
});

app.put(
  "/api/productos/:id",
  upload.single("imagenPrincipal"),
  async (req, res) => {
    const { id } = req.params;
    const {
      categoria,
      modelo,
      descripcion,
      caracteristicas,
      detallesTecnicos,
      tamano,
      currentImage,
    } = req.body;
    const imagen_principal = req.file
      ? `/imagenes_producto/${req.file.filename}`
      : currentImage;

    try {
      const request = new sql.Request();
      request.input("Id_producto", sql.Int, id);
      request.input("Categoria", sql.NVarChar, categoria);
      request.input("Modelo", sql.NVarChar, modelo);
      request.input("Descripcion", sql.NVarChar, descripcion);
      request.input("Caracteristicas", sql.NVarChar, caracteristicas);
      request.input("DetallesTecnicos", sql.NVarChar, detallesTecnicos);
      request.input("Tamano", sql.NVarChar, tamano);
      request.input("Imagen_principal", sql.NVarChar, imagen_principal);
      await request.execute("ActualizarProductoConImagen");
      res.json({ success: true });
    } catch (err) {
      handleError(
        res,
        "Error en la consulta de actualización de producto",
        err
      );
    }
  }
);

app.post(
  "/api/productos",
  upload.single("imagenPrincipal"),
  async (req, res) => {
    const {
      categoria,
      modelo,
      descripcion,
      caracteristicas,
      detallesTecnicos,
      tamano,
    } = req.body;
    const imagen_principal = req.file
      ? `/imagenes_producto/${req.file.filename}`
      : null;

    try {
      const request = new sql.Request();
      request.input("Categoria", sql.NVarChar, categoria);
      request.input("Modelo", sql.NVarChar, modelo);
      request.input("Descripcion", sql.NVarChar, descripcion);
      request.input("Caracteristicas", sql.NVarChar, caracteristicas);
      request.input("DetallesTecnicos", sql.NVarChar, detallesTecnicos);
      request.input("Tamano", sql.NVarChar, tamano);
      request.input("Imagen_principal", sql.NVarChar, imagen_principal);
      await request.execute("InsertarProducto");
      res.json({ success: true });
    } catch (err) {
      handleError(res, "Error al insertar el producto", err);
    }
  }
);

app.post(
  "/api/productos/:id/imagenes",
  upload.array("imagenes", 10),
  async (req, res) => {
    const { id } = req.params;

    try {
      const nuevasImagenes = [];
      if (req.files) {
        for (const file of req.files) {
          const request = new sql.Request();
          request.input("Id_producto", sql.Int, id);
          request.input("Nombre_archivo", sql.NVarChar, file.originalname);
          request.input(
            "Ruta_archivo",
            sql.NVarChar,
            `/imagenes_producto/${file.filename}`
          );
          const result = await request.execute("AgregarImagenes");
          nuevasImagenes.push({
            Id_imagen: result.recordset[0].Id_imagen,
            Nombre_archivo: file.originalname,
            Ruta_archivo: `/imagenes_producto/${file.filename}`,
          });
        }
      }
      res.json({ success: true, imagenes: nuevasImagenes });
    } catch (err) {
      handleError(res, "Error al agregar las imágenes adicionales", err);
    }
  }
);

app.delete("/api/imagenes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const request = new sql.Request();
    request.input("Id_imagen", sql.Int, id);
    await request.execute("EliminarImagen");
    res.json({ success: true });
  } catch (err) {
    handleError(res, "Error en la eliminación de la imagen", err);
  }
});

app.delete("/api/productos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sql.query`EXEC EliminarProducto @Id_producto = ${id}`;
    res.json({ success: true });
  } catch (err) {
    handleError(res, "Error en la consulta de eliminación de producto", err);
  }
});

// Endpoints de Usuarios
app.post("/api/login", async (req, res) => {
  const { email, contrasenna } = req.body;
  try {
    const result = await sql.query`EXEC ObtenerUsuarios`;
    const user = result.recordset.find(
      (u) => u.Email === email && u.Contrasenna === contrasenna
    );
    if (user) {
      res.json({
        success: true,
        user: {
          id: user.Id,
          nombre: user.Nombre,
          apellido: user.Apellido,
          email: user.Email,
          telefono: user.Telefono,
          contrasenna: user.Contrasenna,
          tipoPerfil: user.TipoPerfil,
        },
      });
    } else {
      res.json({ success: false, message: "Datos incorrectos" });
    }
  } catch (err) {
    handleError(res, "Error en la consulta de login", err);
  }
});

app.post("/api/register", async (req, res) => {
  const { nombre, apellido, email, telefono, contrasenna } = req.body;
  try {
    // Primero, verifica si el correo ya está registrado
    const result =
      await sql.query`SELECT * FROM Usuarios WHERE Email = ${email}`;
    if (result.recordset.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "El correo ya está registrado." });
    }

    // Si no está registrado, procede a la inserción
    await sql.query`
      EXEC InsertarUsuario ${nombre}, ${apellido}, ${email}, ${contrasenna}, ${telefono}, 'Cliente'
    `;
    res.json({ success: true });
  } catch (err) {
    handleError(res, "Error en la consulta de registro", err);
  }
});

app.get("/api/clientes", async (req, res) => {
  try {
    const result = await sql.query`EXEC ObtenerUsuarios`;
    const filteredClientes = result.recordset.filter(
      (cliente) => cliente.TipoPerfil !== "Administrador"
    );
    res.json(filteredClientes);
  } catch (err) {
    handleError(res, "Error en la consulta de clientes", err);
  }
});

app.get("/api/clientes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.query`EXEC ObtenerUsuarioPorId @Id = ${id}`;
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (err) {
    handleError(
      res,
      "Error en la consulta de obtención de usuario por ID",
      err
    );
  }
});

app.put("/api/clientes/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, telefono, contrasenna } = req.body;
  try {
    await sql.query`
      EXEC ActualizarUsuario
        @Id = ${id},
        @Nombre = ${nombre},
        @Apellido = ${apellido},
        @Email = ${email},
        @Telefono = ${telefono},
        @Contrasenna = ${contrasenna}
    `;
    res.json({ success: true });
  } catch (err) {
    handleError(res, "Error en la consulta de actualización de usuario", err);
  }
});

// Endpoint para eliminar un cliente
app.delete("/api/clientes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await sql.query`EXEC ObtenerUsuarioPorId @Id = ${id}`;
    if (cliente.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }
    if (cliente.recordset[0].TipoPerfil === "Administrador") {
      return res.status(403).json({
        success: false,
        message: "No se puede eliminar al administrador",
      });
    }
    await sql.query`EXEC EliminarUsuario @IdUsuario = ${id}`;
    res.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (err) {
    handleError(res, "Error en la consulta de eliminación de usuario", err);
  }
});

// Endpoints de Favoritos
app.get("/api/favoritos/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const result = await sql.query`EXEC ObtenerFavoritos ${id_usuario}`;
    if (result.recordset.length > 0) {
      res.json(result.recordset);
    } else {
      res
        .status(200)
        .json({ message: "No se encontraron favoritos para este usuario." });
    }
  } catch (err) {
    handleError(res, "Error en la consulta de favoritos para el usuario", err);
  }
});

app.post("/api/favoritos", async (req, res) => {
  const { id_usuario, id_producto, cantidad } = req.body;
  try {
    if (!id_usuario || !id_producto || !cantidad) {
      return res
        .status(400)
        .send("Faltan datos necesarios para agregar a favoritos.");
    }
    await sql.query`
      EXEC InsertarFavorito @id_usuario=${id_usuario}, @id_producto=${id_producto}, @cantidad=${cantidad}
    `;
    res.json({ success: true });
  } catch (err) {
    handleError(res, "Error al agregar a favoritos", err);
  }
});

app.put("/api/favoritos", async (req, res) => {
  const { id_usuario, id_producto, cantidad } = req.body;
  try {
    await sql.query`
      EXEC ActualizarFavorito ${id_usuario}, ${id_producto}, ${cantidad}
    `;
    res.json({ success: true });
  } catch (err) {
    handleError(res, "Error al actualizar favorito", err);
  }
});

app.delete("/api/favoritos", async (req, res) => {
  const { id_usuario, id_producto } = req.body;
  try {
    await sql.query`
      EXEC EliminarFavorito ${id_usuario}, ${id_producto}
    `;
    res.json({ success: true });
  } catch (err) {
    handleError(res, "Error en la consulta de eliminación de favorito", err);
  }
});

app.delete("/api/favoritos/cantidad-cero", async (req, res) => {
  try {
    await sql.query`EXEC EliminarFavoritosConCantidadCero`;
    res.json({
      success: true,
      message: "Favoritos con cantidad cero eliminados correctamente",
    });
  } catch (err) {
    handleError(res, "Error al eliminar favoritos con cantidad cero", err);
  }
});

// Endpoints de Historial de Pedidos y Detalles de Pedido
app.get("/api/historial-pedidos/:idUsuario", async (req, res) => {
  const { idUsuario } = req.params;
  try {
    const result = await sql.query`
      EXEC ObtenerHistorialPedidos @Id_usuario=${idUsuario}
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving historial de pedidos");
  }
});

app.get("/api/pedido-detalle/:idPedido", async (req, res) => {
  const { idPedido } = req.params;
  try {
    const request = new sql.Request();
    request.input("Id_pedido", sql.Int, idPedido);
    const result = await request.execute("ObtenerDetallesPedido");
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send("Error al obtener los detalles del pedido.");
  }
});

app.get("/api/pedido/:idPedido", async (req, res) => {
  const { idPedido } = req.params;
  try {
    const request = new sql.Request();
    request.input("Id_pedido", sql.Int, idPedido);
    const result = await request.execute("ObtenerPedidoPorId");
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).send("Error al obtener el pedido.");
  }
});

app.post("/api/procesar-favoritos", async (req, res) => {
  const { id_usuario } = req.body;
  try {
    await sql.query`EXEC ProcesarFavoritos ${id_usuario}`;
    res.json({ success: true, message: "Favoritos procesados correctamente" });
  } catch (err) {
    handleError(res, "Error al procesar favoritos", err);
  }
});

// Endpoints de Respaldo y Restauracion
app.get("/api/backup", async (req, res) => {
  try {
    await sql.query`BACKUP DATABASE dbDrija TO DISK = 'C:\\Backups\\dbDrija.bak'`;
    res.json({ success: true, message: "Respaldo realizado correctamente" });
  } catch (err) {
    handleError(res, "Error al realizar el respaldo", err);
  }
});

app.get("/api/restore", async (req, res) => {
  try {
    await sql.query`RESTORE DATABASE dbDrija FROM DISK = 'C:\\Backups\\dbDrija.bak' WITH REPLACE`;
    res.json({
      success: true,
      message: "Restauración realizada correctamente",
    });
  } catch (err) {
    handleError(res, "Error al realizar la restauración", err);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
