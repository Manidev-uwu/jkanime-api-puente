import express from 'express';
import cors from 'cors';
import jkanime from 'jkanime-v2'; // <-- Cambio 1: Importamos toda la librería junta

const app = express();

// Permite que Apps Script acceda a esta API sin bloqueos de seguridad (CORS)
app.use(cors()); 

app.get('/', (req, res) => {
  res.send('API de JKAnime funcionando correctamente 🚀');
});

// Esta ruta obtiene los últimos capítulos
app.get('/api/latest', async (req, res) => {
  try {
    // <-- Cambio 2: Llamamos a la función desde el objeto principal "jkanime"
    const animes = await jkanime.latestAnimeAdded(); 
    res.json(animes);
  } catch (error) {
    console.error(error); // Imprime el error en los logs de Render para depurar
    res.status(500).json({ error: error.message });
  }
});
// Ruta de prueba para ver qué nos responde realmente JKAnime
app.get('/api/diagnostico', async (req, res) => {
  try {
    const respuesta = await fetch('https://jkanime.net/');
    const html = await respuesta.text();
    res.send(html);
  } catch (error) {
    res.status(500).send("Error de red: " + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
