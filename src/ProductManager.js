import fs from "fs";

class ProductManager {
  #path;

  constructor(path) {
    this.#path = path;
  }

  async addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  ) {
    // Obtengo un ID único
    let newID = uniqueID();
    // Recupero los productos
    const products = await this.getProducts();
    // Verifico si hay un producto con ese CODE
    let verifyCode = products.find((p) => p.code === code);
    if (!verifyCode) {
      // Construyo el nuevo Producto
      const newProduct = {
        id: newID,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      };
      try {
        const updatedProducts = [...products, newProduct];
        fs.promises.writeFile(this.#path, JSON.stringify(updatedProducts));
      } catch (err) {
        console.error(err);
      }
    } else {
      throw new Error(`The code ${code} has already been registered.`);
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
      return `There is not a product with ID: ${id}`;
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
        throw new Error(err);
      }
    });
  }

  async deleteProduct(id) {
    // llamo al método getProducts
    const products = await this.getProducts();
    // Verifico el campo ID de cada producto existe en el arreglo
    let allExceptOne = [];
    products.forEach((oneProd) => {
      if (oneProd.id !== id) {
        allExceptOne.push(oneProd);
      }
    });
    try {
      await fs.promises.writeFile(this.#path, JSON.stringify(allExceptOne));
      return `Deleted ${id}`;
    } catch (err) {
      console.error(err);
    }
  }
}

async function main() {}

main();

function uniqueID() {
  // Calculo un ID único
  const today = new Date();
  let day = today.getUTCDay().toString();
  let month = today.getUTCMonth().toString();
  let year = today.getFullYear().toString();
  var hour = today.getUTCHours().toString();
  var minute = today.getUTCMinutes().toString();
  var second = today.getUTCSeconds().toString();
  var milisec = today.getUTCMilliseconds().toString();
  var myID = (day + month + year + hour + minute + second + milisec).toString();
  return myID;
}

export default ProductManager;
