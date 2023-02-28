import { Router, json } from "express";
import CartManager from "../CartManager.js";
import ProductManager from "../ProductManager.js";

const cartsManager = new CartManager("./src/Carts.json");
const productsManager = new ProductManager("./src/Products.json");

const cartsRouter = Router();
cartsRouter.use(json());

const productsRouter = Router();
productsRouter.use(json());

// Ej http://localhost:8080/carts?limit=3 => Primeros tres carritos
// Ej http://localhost:8080/carts => Todos los carritos
cartsRouter.get("/", async (req, res) => {
  // Recupero los carritos
  const carts = await cartsManager.getCarts();
  // Obtengo el valor de limit
  let limit = req.query.limit;
  if (!limit) {
    res.send(carts);
  } else {
    // Selecciono los N carritos
    let selected = [];
    for (let i = 0; i < limit; i++) {
      selected.push(carts[i]);
    }
    // Muestro los carritos seleccionados
    return res.send(selected);
  }
});

// Ej http://localhost:8080/carts/2 => Cart 2
// Ej http://localhost:8080/cart/3412 => Error
cartsRouter.get("/:id", async (req, res) => {
  // Obtengo el valor del elemento
  let id = req.params.id;
  // Recupero los productos
  const carts = await cartsManager.getCarts();
  id = id - 1;
  let selected = carts[id];
  // Muestro el carrito seleccionados
  if (!selected) {
    res
      .status(404)
      .send({ message: `No existe el carrito con el id ${id + 1}` });
  } else {
    res.send(carts[id]);
  }
});

cartsRouter.post("/", async (req, res) => {
  const products = req.body.products;
  let newCart = await cartsManager.addCart(products);
  res.send(newCart);
});

// Postman POST http://localhost:8080/api/carts/11202322154781/product/01202318451768
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  // Recupero los valores de params
  const cartID = req.params.cid;
  const prodID = req.params.pid;
  // Recupero los carritos existentes
  const carts = await cartsManager.getCarts();
  // Recupero los productos existentes
  const prods = await productsManager.getProducts();
  // Verifico si existe ese cartito
  let verifyCart = carts.find((c) => c.id === cartID);
  if (verifyCart) {
    // Verifico si existe ese producto
    let verifyProd = prods.find((p) => p.id === prodID);
    if (verifyProd) {
      let localProducts = verifyCart.products;
      let cantidad = Object.keys(localProducts).length;
      for (let i = 0; i < cantidad; i++) {
        if (localProducts[i].id === prodID) {
          localProducts[i].quantity++;
          cartsManager.updateCart(cartID, localProducts);
          return res.send(cartID);
        }
      }
      return res.send(cartID);
    } else {
      return res
        .status(404)
        .send({ message: `No existe un producto con ID ${prodID}` });
    }
  } else {
    return res
      .status(404)
      .send({ message: `No existe un carrito con ID ${cartID}` });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  // Recupero los valores de params
  const cartID = req.params.cid;
  let deletedCart = await cartsManager.deleteCart(cartID);
  res.send(deletedCart);
});

export default cartsRouter;
