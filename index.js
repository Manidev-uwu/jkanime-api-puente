import express from 'express';
import cors from 'cors';
import { latestAnimeAdded } from 'jkanime-v2';

const app = express();
// Permite que Apps Script acceda a esta API sin bloqueos de seguridad (CORS)
app.use(cors()); 

app.get('/', (req, res) => {
  res.send('API de JKAnime funcionando correctamente 🚀');
});

// Esta ruta obtiene los últimos capítulos usando la librería jkanime-v2
app.get('/api/latest', async (req, res) => {
  try {
    const animes = await latestAnimeAdded();
    res.json(animes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
