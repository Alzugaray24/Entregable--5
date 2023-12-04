import express from "express";
import { Server } from "socket.io";
import ProductManager from "../managers/productManager.js";

const router = express.Router();
const productManager = new ProductManager("productos.json");

router.get("/", (req, res) => {
  res.render("realTimeProducts", {
    style: "realTimeProducts.css",
    productsRealTime: productManager.getProducts(),
  });
});

export const handleWebSocket = (httpServer) => {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.emit("productsRealTime", productManager.getProducts());

    productManager.on("update", (updatedProducts) => {
      io.emit("productsRealTime", updatedProducts);
    });

    socket.on("nuevo_producto", (data) => {
      const requiredFields = ["title", "description", "code", "price", "stock"];
      const missingFields = requiredFields.filter(field => !data[field]);

      if (missingFields.length > 0) {
        const errorMessage = `Los campos siguientes son requeridos: ${missingFields.join(", ")}`;
        socket.emit("mensaje_error", errorMessage);
        return;
      }

      productManager.addProduct(data);
      io.emit("nuevos_productos", productManager.getProducts());
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado");
    });
  });
};

export default router;
