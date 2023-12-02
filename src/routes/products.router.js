// products.router.js
import { Router } from "express";
import ProductManager from '../managers/productManager.js';
import { v4 as uuidv4 } from "uuid";

const productRouter = Router();
const productsManager = new ProductManager("productos.json");

productRouter.get("/", (req, res) => {
  const limit = req.query.limit;

  if (!limit) return res.json({ products: productsManager.getProducts() });

  const productLimit = productsManager.getProducts().slice(0, limit);

  res.json({
    productos: productLimit,
  });
});

productRouter.post("/", (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } =
    req.body;

  if (
    !title ||
    !description ||
    !code ||
    price === undefined ||
    stock === undefined ||
    !category
  ) {
    return res.status(400).json({
      error:
        "Todos los campos obligatorios, excepto 'thumbnails', deben ser proporcionados",
    });
  }

  if (
    typeof code !== "string" ||
    typeof price !== "number" ||
    typeof stock !== "number" ||
    typeof category !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Tipo de datos incorrecto para uno o más campos" });
  }

  const product = {
    id: uuidv4(),
    title: title,
    description: description,
    code: code,
    price: price,
    status: true,
    stock: stock,
    category: category,
    thumbnails: thumbnails || [],
  };

  productsManager.addProduct(product);

  res.json({
    message: "Producto agregado con éxito",
  });
});

productRouter.put("/:pid", (req, res) => {
  const pid = req.params.pid;

  const success = productsManager.updateProduct(pid, req.body);

  if (success) {
    res.json({
      message: "Producto actualizado",
    });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

productRouter.delete("/:pid", (req, res) => {
  const pid = req.params.pid;

  const success = productsManager.deleteProduct(pid);

  if (success) {
    res.json({
      message: "Producto eliminado con éxito",
    });
  } else {
    res.status(400).json({ error: "El producto a eliminar no existe" });
  }
});

export default productRouter;
