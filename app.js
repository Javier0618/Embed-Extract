const express = require('express');
const puppeteer = require('puppeteer');
const chromium = require('@sparticuz/chromium');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Para servir index.html y assets

let stopExtractionFlag = false;

// Función para obtener IMDB ID de TMDB
async function getImdbIdFromTmdb(tmdbId, apiKey, isSeries) {
  const mediaType = isSeries ? 'tv' : 'movie';
  const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}/external_ids?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.imdb_id || null;
}

// Función para obtener estructura de series de TMDB
async function getSeriesInfoFromTmdb(tmdbId, apiKey) {
  const url = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}&language=es-ES`;
  const response = await fetch(url);
  const data = await response.json();
  return data.seasons
    .filter(season => season.season_number > 0)
    .map(season => ({ season: season.season_number, episodes: season.episode_count }));
}

// Función de scraping con Puppeteer (reemplaza extract_links_from_page)
async function extractLinksFromPage(url, serversToExtract, videoLanguage = 'LAT') {
  let browser;
  try {
    // Config para Vercel/serverless
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Verificar si página existe
    const pageSource = (await page.content()).toLowerCase();
    if (pageSource.includes('not found') || pageSource.includes('404') || pageSource.includes('no existe')) {
      return null;
    }

    // Esperar a dataLink
    await page.waitForFunction(() => typeof dataLink !== 'undefined' && dataLink.length > 0, { timeout: 20000 });

    let encryptedData = await page.evaluate(() => dataLink);
    let foundLinks = [];

    // Procesar servidores objetivo
    const targetServers = serversToExtract ? serversToExtract.toLowerCase().split(',').map(s => s.trim()) : [];

    // Intentar enlaces directos
    for (const langData of encryptedData) {
      const currentLanguage = langData.video_language || '';
      if (videoLanguage && currentLanguage !== videoLanguage) continue;

      for (const server of langData.sortedEmbeds || []) {
        const serverName = server.servername.toLowerCase();
        if (targetServers.length && !targetServers.includes(serverName)) continue;

        let linkData = server.link;
        let videoLink = typeof linkData === 'object' ? linkData.link : linkData;
        if (videoLink && videoLink.startsWith('http')) {
          foundLinks.push({ server: serverName, link: videoLink, language: currentLanguage });
        }
      }
    }

    if (foundLinks.length) return foundLinks;

    // Si no, descifrar
    let encryptedLinks = [];
    let linkMap = [];
    for (const langData of encryptedData) {
      const currentLanguage = langData.video_language || '';
      if (videoLanguage && currentLanguage !== videoLanguage) continue;

      for (const server of langData.sortedEmbeds || []) {
        const serverName = server.servername.toLowerCase();
        if (targetServers.length && !targetServers.includes(serverName)) continue;

        encryptedLinks.push(server.link);
        linkMap.push({ language: currentLanguage, server: server.servername, type: server.type });
      }
    }

    if (!encryptedLinks.length) return [];

    // Ejecutar descifrado
    const result = await page.evaluate(async (encryptedLinks) => {
      if (typeof decryptLinks === 'undefined') return { error: 'decryptLinks not found' };
      try {
        return await decryptLinks(encryptedLinks);
      } catch (error) {
        return { error: error.toString() };
      }
    }, encryptedLinks);

    if (result.error || !Array.isArray(result)) return [];

    result.forEach((decryptedLink, i) => {
      const info = linkMap[i];
      let videoLink = typeof decryptedLink === 'object' ? decryptedLink.link : (Array.isArray(decryptedLink) ? decryptedLink[0] : decryptedLink);
      if (videoLink) {
        foundLinks.push({ server: info.server.toLowerCase(), link: videoLink, language: info.language });
      }
    });

    return foundLinks;
  } catch (e) {
    console.error('Error en scraping:', e);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

// Función para obtener datos de TMDB (descripción, imágenes, etc.)
async function getTmdbData(tmdbId, apiKey, isSeries, language = 'es-ES') {
  const mediaType = isSeries ? 'tv' : 'movie';
  const baseUrl = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}`;

  // Info básica
  const infoUrl = `${baseUrl}?api_key=${apiKey}&language=${language}`;
  const infoResponse = await fetch(infoUrl);
  const infoData = await infoResponse.json();
  const description = infoData.overview || 'No hay descripción disponible';

  // Imágenes
  const imagesUrl = `${baseUrl}/images?api_key=${apiKey}&include_image_language=${language},null`;
  const imagesResponse = await fetch(imagesUrl);
  const imagesData = await imagesResponse.json();

  const posters = imagesData.posters.map(p => `https://image.tmdb.org/t/p/original${p.file_path}`);
  const backdrops = imagesData.backdrops.map(b => `https://image.tmdb.org/t/p/original${b.file_path}`);

  let result = { description, posters, backdrops };

  if (isSeries) {
    const seriesInfo = await getSeriesInfoFromTmdb(tmdbId, apiKey);
    let episodeImages = {};
    for (const seasonInfo of seriesInfo) {
      const seasonNum = seasonInfo.season;
      const seasonUrl = `${baseUrl}/season/${seasonNum}?api_key=${apiKey}&language=${language}`;
      const seasonResponse = await fetch(seasonUrl);
      const seasonData = await seasonResponse.json();
      episodeImages[`Temporada ${seasonNum}`] = {};
      seasonData.episodes.forEach(ep => {
        if (ep.still_path) {
          episodeImages[`Temporada ${seasonNum}`][`Episodio ${ep.episode_number}`] = `https://image.tmdb.org/t/p/original${ep.still_path}`;
        }
      });
    }
    result.episode_images = episodeImages;
  }

  return result;
}

// Ruta principal (servir HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta /extract (similar a la original)
app.post('/extract', async (req, res) => {
  stopExtractionFlag = false;
  const { tmdb_id, type, server, video_language = 'LAT', extraction_mode = 'specific', season, episode, season_start, season_end } = req.body;
  const isSeries = type === 'series';
  const TMDB_API_KEY = '32e5e53999e380a0291d66fb304153fe'; // Mejor pon en env var

  if (!tmdb_id) return res.json({ status: 'error', message: 'El ID de TMDB es obligatorio.' });

  const imdbId = await getImdbIdFromTmdb(tmdb_id, TMDB_API_KEY, isSeries);
  if (!imdbId) return res.json({ status: 'error', message: 'No se encontró el ID de IMDB.' });

  let finalResults = {};
  let unavailableSeasons = [];

  if (isSeries) {
    const seriesData = await getSeriesInfoFromTmdb(tmdb_id, TMDB_API_KEY);
    if (!seriesData) return res.json({ status: 'error', message: 'No se pudo obtener info de episodios.' });

    // Lógica de extracción similar a la original (specific, full_season, season_range, etc.)
    // ... (adapta el resto de la lógica de extract() aquí, usando extractLinksFromPage en lugar de extract_links_from_page)
    // Nota: Es larga, pero es similar. Por brevedad, asume que la implementas como en Python, pero con await para async.
    // Ejemplo para modo specific:
    if (extraction_mode === 'specific' && season && episode) {
      const seasonNum = parseInt(season);
      const episodeNum = parseInt(episode);
      // Valida como en original
      const episodeUrl = `https://embed69.org/f/${imdbId}-${seasonNum}x${episodeNum.toString().padStart(2, '0')}/`;
      const links = await extractLinksFromPage(episodeUrl, server, video_language);
      if (links === null) return res.json({ status: 'error', message: `Episodio no disponible.` });
      finalResults[`Temporada ${seasonNum}`] = { [`Episodio ${episodeNum}`]: links || [] };
    }
    // Agrega el resto: loops con check de stopExtractionFlag, etc.
  } else {
    const movieUrl = `https://embed69.org/f/${imdbId}/`;
    const links = await extractLinksFromPage(movieUrl, server, video_language);
    if (links === null) return res.json({ status: 'error', message: 'Película no disponible.' });
    finalResults['Película'] = links || [];
  }

  res.json({ status: 'success', data: finalResults });
});

// Ruta /stop_extraction
app.post('/stop_extraction', (req, res) => {
  stopExtractionFlag = true;
  res.json({ status: 'success', message: 'Detención solicitada' });
});

// Ruta /extract_tmdb
app.post('/extract_tmdb', async (req, res) => {
  const { tmdb_id, type, language = 'es-ES' } = req.body;
  const isSeries = type === 'series';
  const TMDB_API_KEY = '32e5e53999e380a0291d66fb304153fe';

  if (!tmdb_id) return res.json({ status: 'error', message: 'ID obligatorio.' });

  const tmdbData = await getTmdbData(tmdb_id, TMDB_API_KEY, isSeries, language);
  if (!tmdbData) return res.json({ status: 'error', message: 'No se pudo obtener info.' });

  res.json({ status: 'success', data: tmdbData, is_series: isSeries });
});

// Ruta /search_tmdb
app.get('/search_tmdb', async (req, res) => {
  const { query, type = 'multi' } = req.query;
  if (!query || query.length < 2) return res.json({ status: 'success', results: [] });

  const TMDB_API_KEY = '32e5e53999e380a0291d66fb304153fe';
  let url;
  if (type === 'multi') url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=es-ES&query=${query}&page=1`;
  else if (type === 'movie') url = `https://api.themoviedb.org/3/search/movie?...`; // Completa similar

  const response = await fetch(url);
  const data = await response.json();
  const results = data.results.filter(item => item.media_type !== 'person').slice(0, 10).map(item => ({
    id: item.id,
    title: item.title || item.name,
    year: (item.release_date || item.first_air_date || '').slice(0, 4),
    media_type: item.media_type === 'tv' ? 'series' : 'movie',
    poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : null
  }));

  res.json({ status: 'success', results });
});

app.listen(port, () => console.log(`App running on port ${port}`));
