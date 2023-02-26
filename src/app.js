import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use(express.static(__dirname + "/../public"));

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
