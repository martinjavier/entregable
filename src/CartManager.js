import fs from "fs";

class CartManager {
  #path;

  constructor(path) {
    this.#path = path;
  }

  async addCart(products) {
    // Obtengo un ID único
    let newID = uniqueID();
    // Recupero los carritos existentes
    const carts = await this.getCarts();
    // Construyo el nuevo carrito
    const newCart = {
      id: newID,
      products,
    };
    // Grabo los carritos
    try {
      const updatedCarts = [...carts, newCart];
      fs.promises.writeFile(this.#path, JSON.stringify(updatedCarts));
    } catch (err) {
      console.error(err);
    }
  }

  async getCarts() {
    try {
      const carts = await fs.promises.readFile(this.#path, "utf-8");
      return JSON.parse(carts);
    } catch (e) {
      return [];
    }
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    let verifyCart = carts.find((c) => c.id === id);
    if (verifyCart) {
      return verifyCart;
    } else {
      return `There is not a cart with ID: ${id}`;
    }
  }

  async updateCart(id, products) {
    // defino un arreglo vacío
    let carts = [];
    // llamo al método getCarts
    const cartPromise = await this.getCarts();
    // vuelvo a armar mi arreglo
    cartPromise.forEach((oneCart) => {
      carts.push(oneCart);
    });
    // Verifico el campo ID de cada producto existe en el arreglo
    carts.forEach((oneCart) => {
      const verifyCart = oneCart.id === id;
      try {
        if (verifyCart) {
          const updatedCart = {
            id,
            products,
          };
          let allButOne = [];
          carts.forEach((oneCart) => {
            if (oneCart.id != id) {
              allButOne.push(oneCart);
            } else {
              allButOne.push(updatedCart);
            }
          });
          // Grabo el archivo con los carritos actualizados
          fs.promises.writeFile(this.#path, JSON.stringify(allButOne));
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Postman DELETE http://localhost:8080/api/carts/11202322030908
  async deleteCart(id) {
    // llamo al método getProducts
    const carts = await this.getCarts();
    // Verifico el campo ID de cada carrito existente en el arreglo
    let allExceptOne = [];
    carts.forEach((oneCart) => {
      if (oneCart.id != id) {
        allExceptOne.push(oneCart);
      }
    });
    try {
      await fs.promises.writeFile(this.#path, JSON.stringify(allExceptOne));
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

export default CartManager;
