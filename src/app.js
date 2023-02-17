import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const manager = new ProductManager("./src/Productos.json");

// Ej http://localhost:8080/products
app.get("/products", async (req, res) => {
  // Recupero los productos
  const products = await manager.getProducts();
  // Muestro todos los productos
  return res.send(products);
});

// Ej http://localhost:8080/productos?limit=3
app.get("/productos", async (req, res) => {
  // Obtengo el valor de limit
  const limit = req.query.limit;
  // Recupero los productos
  const products = await manager.getProducts();
  // Selecciono los N productos
  let selected = [];
  for (let i = 0; i < limit; i++) {
    selected.push(products[i]);
  }
  // Muestro los productos seleccionados
  return res.send(selected);
});

// Ej http://localhost:8080/products/2
app.get("/products/:id", async (req, res) => {
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

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
