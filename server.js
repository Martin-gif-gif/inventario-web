const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const ARCHIVO = "inventario.json";

// -------- INVENTARIO --------
function leerDatos() {
  try {
    return JSON.parse(fs.readFileSync(ARCHIVO, "utf8"));
  } catch {
    return [];
  }
}

function guardarDatos(data) {
  fs.writeFileSync(ARCHIVO, JSON.stringify(data, null, 2));
}

app.get("/productos", (req, res) => {
  res.json(leerDatos());
});

app.post("/productos", (req, res) => {
  let inventario = leerDatos();
  const { nombre, cantidad, danado } = req.body;

  inventario.push({
    nombre,
    cantidad: Number(cantidad) || 0,
    danado: Number(danado) || 0
  });

  guardarDatos(inventario);
  res.json({ ok: true });
});

app.delete("/productos/:id", (req, res) => {
  let inventario = leerDatos();
  inventario.splice(req.params.id, 1);
  guardarDatos(inventario);
  res.json({ ok: true });
});

// -------- EVENTOS --------
app.get("/eventos", (req, res) => {
  try {
    res.json(JSON.parse(fs.readFileSync("eventos.json", "utf8")));
  } catch {
    res.json([]);
  }
});

app.post("/eventos", (req, res) => {
  let eventos = [];
  let inventario = leerDatos();

  try {
    eventos = JSON.parse(fs.readFileSync("eventos.json", "utf8"));
  } catch {}

  const nuevoEvento = req.body;

  // Restar inventario
  nuevoEvento.productos.forEach(p => {
    let item = inventario.find(i => i.nombre === p.nombre);

    if (item) {
      if (item.cantidad >= p.cantidad) {
        item.cantidad -= p.cantidad;
      } else {
        item.cantidad = 0;
      }
    }
  });

  eventos.push(nuevoEvento);
 // Eliminar evento
app.delete("/eventos/:id", (req, res) => {
  let eventos = [];

  try {
    eventos = JSON.parse(fs.readFileSync("eventos.json", "utf8"));
  } catch {}

  eventos.splice(req.params.id, 1);

  fs.writeFileSync("eventos.json", JSON.stringify(eventos, null, 2));

  res.json({ ok: true });
});
  guardarDatos(inventario);
  fs.writeFileSync("eventos.json", JSON.stringify(eventos, null, 2));

  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo");
});