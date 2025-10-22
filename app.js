const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000; // Cambia si quieres

let stopExtractionFlag = false;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // Sirve archivos estáticos (HTML, CSS, JS)

// Ruta principal (sirve el HTML)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Ruta para detener extracción
app.post('/stop_extraction', (req, res) => {
  stopExtractionFlag = true;
  console.log('--- [DEBUG] STOP EXTRACTION solicitado ---');
  res.json({ status: 'success', message: 'Detención solicitada' });
});

// Ruta para extraer enlaces (equivalente a /extract)
app.post('/extract', async (req, res) => {
  stopExtractionFlag = false;
  const { tmdb_id, type, server, video_language = 'LAT', extraction_mode = 'specific', season, episode, season_start, season_end } = req.body;
  const isSeries = type === 'series';

  console.log(`--- [DEBUG] Form: TMDB_ID=${tmdb_id}, Type=${isSeries ? 'Series' : 'Movie'}, Server=${server}, Lang=${video_language} ---`);
  console.log(`--- [DEBUG] Mode: ${extraction_mode}, Season=${season}, Episode=${episode}, Range=${season_start}-${season_end} ---`);

  if (!tmdb_id) return res.json({ status: 'error', message: 'TMDB ID requerido' });

  const TMDB_API_KEY = '32e5e53999e380a0291d66fb304153fe';
  let browser = null;

  try {
    const imdbId = await getImdbIdFromTmdb(tmdb_id, TMDB_API_KEY, isSeries);
    if (!imdbId) return res.json({ status: 'error', message: 'No se encontró IMDB ID' });

    console.log('--- [DEBUG] Lanzando Puppeteer ---');
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    const finalResults = {};
    let unavailableSeasons = [];

    if (isSeries) {
      const seriesData = await getSeriesInfoFromTmdb(tmdb_id, TMDB_API_KEY);
      if (!seriesData) return res.json({ status: 'error', message: 'No se pudo obtener info de episodios' });

      // Lógica similar a tu Python: maneja modos (specific, full_season, season_range, etc.)
      // (Abrevío por espacio, pero copia la lógica de tu app.py aquí usando Puppeteer en lugar de Selenium)
      // Ejemplo para modo specific:
      if (extraction_mode === 'specific' && season && episode) {
        const seasonNum = parseInt(season);
        const episodeNum = parseInt(episode);
        const episodeUrl = `https://embed69.org/f/${imdbId}-${seasonNum}x${episodeNum.toString().padStart(2, '0')}/`;
        const links = await extractLinksFromPage(page, episodeUrl, server, video_language);
        if (links === null) return res.json({ status: 'error', message: `Episodio no disponible` });
        finalResults[`Temporada ${seasonNum}`] = { [`Episodio ${episodeNum}`]: processLinksByServer(links) };
      }
      // Agrega el resto de modos similarmente, chequeando stopExtractionFlag

    } else {
      const movieUrl = `https://embed69.org/f/${imdbId}/`;
      const links = await extractLinksFromPage(page, movieUrl, server, video_language);
      if (links === null) return res.json({ status: 'error', message: 'Película no disponible' });
      finalResults['Película'] = processLinksByServer(links);
    }

    const responseData = { status: 'success', data: finalResults };
    if (unavailableSeasons.length) responseData.warning = `Temporadas no disponibles: ${unavailableSeasons.join(', ')}`;
    res.json(responseData);

  } catch (e) {
    console.error(`--- [DEBUG] ERROR: ${e} ---`);
    res.json({ status: 'error', message: `Error: ${e.message}` });
  } finally {
    if (browser) await browser.close();
  }
});

// Otras rutas: /extract_tmdb, /search_tmdb (usa fetch a TMDB API directamente)
app.post('/extract_tmdb', async (req, res) => {
  // Similar a tu Python, usa fetch para TMDB
  // Implementa getTmdbData aquí
});

app.get('/search_tmdb', async (req, res) => {
  // Implementa búsqueda TMDB
});

// Funciones helper (adaptadas de tu Python)
async function getImdbIdFromTmdb(tmdbId, apiKey, isSeries) {
  const mediaType = isSeries ? 'tv' : 'movie';
  const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}/external_ids?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.imdb_id || null;
}

// extractLinksFromPage usando Puppeteer
async function extractLinksFromPage(page, url, servers, videoLanguage) {
  console.log(`--- [DEBUG] Extrayendo de ${url} ---`);
  await page.goto(url, { waitUntil: 'networkidle2' });
  // Espera dataLink, ejecuta JS para decrypt, etc. (adapta tu lógica de Selenium)
  // Ejemplo:
  try {
    await page.waitForFunction(() => typeof dataLink !== 'undefined' && dataLink.length > 0, { timeout: 20000 });
    const encryptedData = await page.evaluate(() => dataLink);
    // Procesa como en tu Python
    // ... (implementa el resto)
    return []; // Retorna enlaces
  } catch (e) {
    return null;
  }
}

// Agrega las otras funciones: getSeriesInfoFromTmdb, processLinksByServer, etc.

app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
