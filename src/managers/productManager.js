import fs from 'fs';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

class ProductManager extends EventEmitter {
  constructor(filePath) {
    super();
    this.filePath = filePath;
    this.products = this.readFromFile();
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
    fs.writeFileSync(
      this.filePath,
      JSON.stringify(this.products, null, 2),
      'utf-8'
    );

    this.emit('update', this.products);
  }

  generateUUID() {
    return uuidv4();
  }

  getProducts() {
    return this.products;
  }

  addProduct(product) {
    const productId = this.generateUUID();
    const productWithId = { id: productId, ...product };

    // Convertir price y stock a números
    productWithId.price = parseFloat(productWithId.price);
    productWithId.stock = parseInt(productWithId.stock);

    this.products.push(productWithId);
    this.writeToFile();
  }

  updateProduct(productId, newData) {
    const index = this.products.findIndex((el) => el.id === productId);

    if (index !== -1) {
      // Convertir price y stock a números antes de actualizar
      newData.price = parseFloat(newData.price);
      newData.stock = parseInt(newData.stock);

      this.products[index] = { ...this.products[index], ...newData };
      this.writeToFile();
      return true;
    }

    return false;
  }

  deleteProduct(productId) {
    const index = this.products.findIndex((el) => el.id === productId);

    if (index !== -1) {
      this.products.splice(index, 1);
      this.writeToFile();
      return true;
    }

    return false;
  }
}

export default ProductManager;
