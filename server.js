const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// 🔥 CONEXIÓN
mongoose.connect("mongodb://martinbalitan_db_user:20Mm25122@ac-isjd52x-shard-00-00.qy6rkfp.mongodb.net:27017,ac-isjd52x-shard-00-01.qy6rkfp.mongodb.net:27017,ac-isjd52x-shard-00-02.qy6rkfp.mongodb.net:27017/?ssl=true&replicaSet=atlas-3is3xe-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log(err));

// =====================
// MODELOS
// =====================
const Producto = mongoose.model("Producto", new mongoose.Schema({
  nombre: String,
  cantidad: Number,
  danado: Number,
  tipo: String
}));

const Evento = mongoose.model("Evento", new mongoose.Schema({
  nombre: String,
  productos: [
    {
      nombre: String,
      tipo: String,
      cantidad: Number
    }
  ]
}));

// =====================
// PRODUCTOS
// =====================
app.post("/productos", async (req, res) => {
  const nuevo = new Producto(req.body);
  await nuevo.save();
  res.json({ ok: true });
});

app.get("/productos/:tipo", async (req, res) => {
  const data = await Producto.find({ tipo: req.params.tipo });
  res.json(data);
});

app.delete("/productos/:id", async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// EVENTOS
// =====================
app.post("/eventos", async (req, res) => {
  const nuevo = new Evento(req.body);
  await nuevo.save();
  res.json({ ok: true });
});

app.get("/eventos", async (req, res) => {
  const data = await Evento.find();
  res.json(data);
});

app.delete("/eventos/:id", async (req, res) => {
  try {
    await Evento.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// SERVER
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en puerto " + PORT);
});