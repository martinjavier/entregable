import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const manager = new ProductManager("./src/Productos.json");

// Ej http://localhost:8080/products?limit=3 => Primeros tres productos
// Ej http://localhost:8080/products => Todos los productos
app.get("/products", async (req, res) => {
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
