const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   CONEXIÓN MONGODB ATLAS
========================= */
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log('✅ MongoDB conectado correctamente'))
.catch(err => console.error('❌ Error MongoDB:', err));

/* =========================
   MODELO PERFUME
========================= */
const PerfumeSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  stock: Number,
  tipo: String,
  imagen: String,
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

const Perfume = mongoose.model('Perfume', PerfumeSchema);

/* =========================
   MIDDLEWARE
========================= */
app.use(express.static('public'));
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true
}));

/* =========================
   RUTAS API
========================= */

// 🔹 OBTENER PERFUMES (STOCK + ADMIN)
app.get('/api/perfumes', async (req, res) => {
  try {
    const perfumes = await Perfume.find().sort({ creadoEn: -1 });
    res.json(perfumes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfumes' });
  }
});

// 🔹 AGREGAR PERFUME (ADMIN)
app.post('/api/perfumes', async (req, res) => {
  try {
    const { nombre, precio, stock, tipo } = req.body;

    if (!req.files || !req.files.imagen) {
      return res.status(400).send('No se ha subido ninguna imagen');
    }

    // carpeta uploads
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // guardar imagen
    const imagen = req.files.imagen;
    const nombreImagen = Date.now() + '_' + imagen.name;
    const rutaImagen = path.join(uploadDir, nombreImagen);

    await imagen.mv(rutaImagen);

    // guardar en MongoDB
    const nuevoPerfume = new Perfume({
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      tipo,
      imagen: `/uploads/${nombreImagen}`
    });

    await nuevoPerfume.save();

    res.send('Perfume agregado correctamente');

  } catch (err) {
    console.error('❌ ERROR:', err);
    res.status(500).send('Error interno del servidor');
  }
});

// 🔹 EDITAR PERFUME (ADMIN)
app.put('/api/perfumes/:id', async (req, res) => {
  try {
    const { nombre, precio, stock, tipo } = req.body;

    await Perfume.findByIdAndUpdate(req.params.id, {
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      tipo
    });

    res.send('Perfume actualizado correctamente');
  } catch (err) {
    console.error('❌ Error editar:', err);
    res.status(500).send('Error al editar perfume');
  }
});

// 🔹 ELIMINAR PERFUME (ADMIN)
app.delete('/api/perfumes/:id', async (req, res) => {
  try {
    await Perfume.findByIdAndDelete(req.params.id);
    res.send('Perfume eliminado correctamente');
  } catch (err) {
    console.error('❌ Error eliminar:', err);
    res.status(500).send('Error al eliminar perfume');
  }
});

/* =========================
   FRONTEND
========================= */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* =========================
   START
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});