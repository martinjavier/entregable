import fs from "fs";

class ProductManager {
  #path;
  #amount = 0;

  constructor(path) {
    this.#path = path;
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    // Recupero los productos
    const products = await this.getProducts();
    //console.log("PROD: " + JSON.stringify(products));
    // Verifico si hay un producto con ese CODE
    let verifyCode = products.find((p) => p.code === code);
    if (!verifyCode) {
      // Construyo el nuevo Producto
      const newProduct = {
        id: this.#amount,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      try {
        const updatedProducts = [...products, newProduct];
        // console.log("Updated: " + updatedProducts);
        fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts));
        this.#amount++;
      } catch (err) {
        console.error(err);
      }
    } else {
      //throw new Error(`El código ${code} ya esta registrado.`);
      console.error(`El código ${code} ya esta registrado.`);
    }
  }

  async getProducts() {
    try {
      const products = await fs.promises.readFile(this.#path, "utf-8");
      return JSON.parse(products);
    } catch (e) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    let verifyProduct = products.find((p) => p.id === id);
    if (verifyProduct) {
      return verifyProduct;
    } else {
      return `No existe un producto con ID: ${id}`;
    }
  }

  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    // defino un arreglo vacío
    let products = [];
    // llamo al método getProducts
    const productsPromise = await this.getProducts();
    // vuelvo a armar mi arreglo
    productsPromise.forEach((oneProd) => {
      products.push(oneProd);
    });
    // Verifico el campo ID de cada producto existe en el arreglo
    products.forEach((oneProd) => {
      const verifyProduct = oneProd.id === id;
      try {
        if (verifyProduct) {
          const updatedProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
          };
          let allButOne = [];
          products.forEach((oneProd) => {
            if (oneProd.id != id) {
              allButOne.push(oneProd);
            } else {
              allButOne.push(updatedProduct);
            }
          });
          // Grabo el archivo con los productos actualizados
          fs.promises.writeFile(this.#path, JSON.stringify(allButOne));
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  async deleteProduct(id) {
    // defino un arreglo vacío
    let products = [];
    // llamo al método getProducts
    const productsPromise = await this.getProducts();
    // vuelvo a armar mi arreglo
    productsPromise.forEach((oneProd) => {
      products.push(oneProd);
    });
    // Verifico el campo ID de cada producto existe en el arreglo
    let allExceptOne = [];
    products.forEach((oneProd) => {
      if (oneProd.id != id) {
        allExceptOne.push(oneProd);
      }
    });
    try {
      await fs.promises.writeFile(
        "./Productos.json",
        JSON.stringify(allExceptOne)
      );
    } catch (err) {
      console.error(err);
    }
  }
}

async function main() {}

main();

export default ProductManager;
