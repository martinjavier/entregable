import { Router, json } from "express";
import ProductManager from "../ProductManager.js";

const manager = new ProductManager("./src/Products.json");

const productsRouter = Router();
productsRouter.use(json());

// Ej http://localhost:8080/products?limit=3 => Primeros tres productos
// Ej http://localhost:8080/products => Todos los productos
productsRouter.get("/", async (req, res) => {
  // Recupero los productos
  const products = await manager.getProducts();
  // Obtengo el valor de limit
  let limit = req.query.limit;
  if (!limit) {
    res.send(products);
  } else {
    // Selecciono los N productos
    let selected = [];
    for (let i = 0; i < limit; i++) {
      selected.push(products[i]);
    }
    // Muestro los productos seleccionados
    return res.send(selected);
  }
});

// Ej http://localhost:8080/products/2 => Prod 2
// Ej http://localhost:8080/products/3412 => Error
productsRouter.get("/:id", async (req, res) => {
  // Obtengo el valor del elemento
  let id = req.params.id;
  // Recupero los productos
  const products = await manager.getProducts();
  id = id - 1;
  let selected = products[id];
  // Muestro el producto seleccionados
  if (!selected) {
    res.status(404).send({ message: `No existe el producto con el id ${id}` });
  } else {
    res.send(products[id]);
  }
});

productsRouter.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  let newProd = await manager.addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  );
  res.send(newProd);
});

productsRouter.post("/:id", async (req, res) => {
  // Obtengo el valor del elemento
  let prodID = req.params.id;
  // Obtengo todos los valores del body
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;
  // Armo los valores actualizados del Producto
  let updatedProd = await manager.updateProduct(
    (id = prodID),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  );
  res.send(updatedProd);
});

productsRouter.delete("/:id", async (req, res) => {
  // Obtengo el valor del elemento
  let prodID = req.params.id;
  // Armo los valores actualizados del Producto
  let deletedProd = await manager.deleteProduct(prodID);
  res.send(deletedProd);
});

export default productsRouter;
