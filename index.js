import express from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio'; // Usamos cheerio para extraer los datos nosotros mismos

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('API Personalizada de JKAnime funcionando correctamente 🚀');
});

app.get('/api/latest', async (req, res) => {
  try {
    // 1. Entramos a la página principal de JKAnime
    const respuesta = await fetch('https://jkanime.net/');
    const html = await respuesta.text();
    
    // 2. Cargamos el HTML para poder buscar etiquetas (como si fuera jQuery)
    const $ = cheerio.load(html);
    const animes = [];

    // 3. Buscamos las tarjetas de los últimos capítulos
    // JKAnime suele cambiar sus clases, aquí buscamos en los contenedores más comunes
    $('a.list-group-item, .anime__item a, .bloque-home a, .maximo-w a').each((index, elemento) => {
      const url = $(elemento).attr('href');
      // Buscamos el texto del título dentro del enlace
      const title = $(elemento).find('h5, h6, .title').text().trim() || $(elemento).text().trim();
      
      // Filtramos para asegurarnos de que sea un enlace válido de anime y no esté vacío
      if (url && title && url.includes('jkanime.net') && title.length > 2) {
        animes.push({
          title: title,
          episode: 'Episodio Reciente',
          url: url
        });
      }
    });

    // 4. Limpiamos resultados duplicados y enviamos los primeros 12
    const animesUnicos = [...new Map(animes.map(item => [item.url, item])).values()].slice(0, 12);

    res.json(animesUnicos);
  } catch (error) {
    res.status(500).json({ error: "Error al scrapear: " + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
