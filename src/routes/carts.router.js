import { Router } from 'express';
import CartsManager from '../managers/cartsManager.js';
import ProductManager from '../managers/productManager.js';
import { v4 as uuidv4 } from "uuid";

const cartRouter = Router();
const cartsManager = new CartsManager('carts.json');
const productsManager = new ProductManager('productos.json');

cartRouter.get('/', (req, res) => {
  res.json({
    carts: cartsManager.getCarts(),
  });
});

cartRouter.post('/', (req, res) => {
  const { idProduct } = req.body;

  if (!idProduct) {
    return res
      .status(400)
      .json({
        error: 'Debe ingresar el producto que quiere agregar al carrito',
      });
  }

  const product = productsManager.getProducts().find((el) => el.id === idProduct);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  const cart = {
    idCart: uuidv4(),
    products: [product],
  };

  cartsManager.addCart(cart);

  res.json({
    message: 'El carrito se creó con éxito',
    idCart: cart.idCart,
  });
});

cartRouter.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  const success = cartsManager.addProductToCart(cid, pid);

  if (success) {
    res.json({
      message: `Producto con el id ${pid} agregado al carrito con el id ${cid}`,
      cart: cartsManager.getCartById(cid),
    });
  } else {
    res.status(400).json({ error: 'Error al agregar el producto al carrito' });
  }
});

cartRouter.get('/:cid', (req, res) => {
  const cid = req.params.cid;

  if (!cid) {
    return res.status(400).json({ error: 'Error al hacer la búsqueda' });
  }

  const cart = cartsManager.getCartById(cid);

  if (!cart) {
    return res
      .status(400)
      .json({ error: `El carrito con el id ${cid} no existe` });
  }

  res.json({
    message: 'Carrito encontrado',
    cart: cart,
  });
});

export default cartRouter;
