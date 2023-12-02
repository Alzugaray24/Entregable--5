import fs from 'fs';
import { EventEmitter } from 'events';

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

  getProducts() {
    return this.products;
  }

  addProduct(product) {
    this.products.push(product);
    this.writeToFile();
  }

  updateProduct(productId, newData) {
    const index = this.products.findIndex((el) => el.id === productId);

    if (index !== -1) {
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
