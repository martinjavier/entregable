import express from "express";

const app = express();

const users = [
  { id: "1", name: "Franco", city: "Londres" },
  { id: "2", name: "Francisco", city: "Londres" },
  { id: "3", name: "Maria", city: "Buenos Aires" },
  { id: "4", name: "Juan" },
  { id: "5", name: "Pedro" },
];

app.get("/users", (req, res) => {
  //res.json(users);
  const { city } = req.query;
  if (city) {
    res.send(users.filter((u) => u.city === city));
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res
      .status(404)
      .send({ error: `No existe el usuario con ID ${req.params.id}` });
  } else {
    res.json(user);
  }
});

app.get("/unparametro/:nombre", (req, res) => {
  console.log(req.params.nombre);
  res.send(`Bienvenid@, ${req.params.nombre}`);
});

app.get("/dosparametros/:nombre/:apellido", (req, res) => {
  res.send(`Bienvenid@, ${req.params.nombre} ${req.params.apellido}`);
});

app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
