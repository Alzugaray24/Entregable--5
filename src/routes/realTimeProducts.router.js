import express from 'express';
import { Server } from 'socket.io';
import ProductManager from '../managers/productManager.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('realTimeProducts', {
    style: 'realTimeProducts.css',
    productsRealTime: [],
  });
});

export const handleWebSocket = (httpServer) => {
  const io = new Server(httpServer);
  const productManager = new ProductManager('productos.json');

  io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    const productsRealTime = productManager.getProducts();
    socket.emit('productsRealTime', productsRealTime);

    productManager.on('update', (updatedProducts) => {
      io.emit('productsRealTime', updatedProducts);
    });

    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });
};

export default router;
