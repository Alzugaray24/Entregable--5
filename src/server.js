import express from "express";
import { __dirname } from "./dirname.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import ProductManager from "./managers/productManager.js";
import realTimeProductRouter, { handleWebSocket } from "./routes/realTimeProducts.router.js";

const app = express();
const PORT = 8080;

// Configuración del motor de plantillas Handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

// Creación de una instancia de ProductManager
const productManager = new ProductManager("productos.json");

// Ruta para la página de inicio
app.get("/home", (req, res) => {
  const products = productManager.getProducts();
  res.render("home", {
    style: "home.css",
    products,
  });
});

// Otros middleware y enrutadores
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/realtimeproducts", realTimeProductRouter);

// Configuración de Socket.IO
const httpServer = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Pasa el servidor de Express a la función handleWebSocket
handleWebSocket(httpServer, productManager);

