import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

class CartsManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = this.readFromFile();
  }

  readFromFile() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  writeToFile() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2), 'utf-8');
  }

  getCarts() {
    return this.carts;
  }

  addCart(cart) {
    this.carts.push(cart);
    this.writeToFile();
  }

  getCartById(cartId) {
    return this.carts.find((el) => el.idCart === cartId);
  }

  addProductToCart(cartId, productId) {
    const cart = this.getCartById(cartId);

    if (!cart) {
      console.log('Carrito no encontrado.');
      return false;
    }

    const existingProduct = cart.products.find((item) => item.id === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      const newProduct = {
        id: uuidv4(),
        productId: productId,
        quantity: 1,
      };

      cart.products.push(newProduct);
    }

    this.writeToFile();
    return true;
  }
}

export default CartsManager;
