const express = require('express');
const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const chromium = require('@sparticuz/chromium');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

puppeteerExtra.use(StealthPlugin());

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let stopExtractionFlag = false;

const TMDB_API_KEY = process.env.TMDB_API_KEY || '32e5e53999e380a0291d66fb304153fe';

async function getImdbIdFromTmdb(tmdbId, isSeries) {
  console.log(`--- [DEBUG] Buscando IMDB ID para TMDB ID: ${tmdbId} (Es serie: ${isSeries}) ---`);
  const mediaType = isSeries ? 'tv' : 'movie';
  const url = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const imdbId = response.data.imdb_id;
    console.log(`--- [DEBUG] Respuesta de TMDB (IMDB): ${imdbId} ---`);
    return imdbId;
  } catch (e) {
    console.error(`--- [DEBUG] ERROR consultando TMDB para IMDB: ${e.message} ---`);
    return null;
  }
}

async function getSeriesInfoFromTmdb(tmdbId) {
  console.log(`--- [DEBUG] Buscando info de episodios para TMDB ID: ${tmdbId} ---`);
  const url = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=es-ES`;
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data;
    const seriesStructure = data.seasons
      .filter(season => season.season_number > 0)
      .map(season => ({
        season: season.season_number,
        episodes: season.episode_count
      }));
    console.log(`--- [DEBUG] Estructura de series encontrada: ${JSON.stringify(seriesStructure)} ---`);
    return seriesStructure;
  } catch (e) {
    console.error(`--- [DEBUG] ERROR consultando TMDB para episodios: ${e.message} ---`);
    return null;
  }
}

async function extractLinksFromPage(url, serversToExtract, videoLanguage = 'LAT') {
  console.log(`--- [DEBUG] Extrayendo enlaces de: ${url} (Idioma: ${videoLanguage}) ---`);
  const puppeteer = puppeteerExtra;
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      ],
      defaultViewport: { width: 1280, height: 720 },
      executablePath: process.env.NETLIFY
        ? '/opt/build/repo/node_modules/@sparticuz/chromium/bin'
        : await chromium.executablePath(),
      headless: 'new',
      ignoreHTTPSErrors: true,
      timeout: 60000
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const pageSource = (await page.content()).toLowerCase();
    if (pageSource.includes('not found') || pageSource.includes('404') || pageSource.includes('no existe')) {
      console.log(`--- [DEBUG] Página no encontrada (404): ${url} ---`);
      return null;
    }

    await page.waitForFunction(() => typeof dataLink !== 'undefined' && dataLink.length > 0, { timeout: 60000 });
    console.log(`--- [DEBUG] dataLink encontrado en ${url} ---`);

    const encryptedData = await page.evaluate(() => dataLink);
    console.log(`--- [DEBUG] encrypted_data (crudo): ${JSON.stringify(encryptedData)} ---`);

    let targetServers = [];
    if (serversToExtract) {
      if (typeof serversToExtract === 'string') {
        targetServers = serversToExtract.split(',').map(s => s.trim().toLowerCase());
      } else if (Array.isArray(serversToExtract)) {
        targetServers = serversToExtract.map(s => s.trim().toLowerCase());
      }
    }
    console.log(`--- [DEBUG] Servidores objetivo: ${targetServers} ---`);

    let foundLinks = [];
    for (const langData of encryptedData) {
      const currentLanguage = langData.video_language || '';
      if (videoLanguage && currentLanguage !== videoLanguage) continue;

      for (const server of langData.sortedEmbeds || []) {
        const serverName = server.servername.toLowerCase();
        if (targetServers.length && !targetServers.includes(serverName)) continue;

        let linkData = server.link;
        let videoLink = '';
        if (typeof linkData === 'object') videoLink = linkData.link;
        else if (typeof linkData === 'string') videoLink = linkData;

        if (videoLink && videoLink.startsWith('http')) {
          foundLinks.push({ server: serverName, link: videoLink, language: currentLanguage });
          console.log(`--- [DEBUG] Enlace directo encontrado para ${serverName} (${currentLanguage}): ${videoLink} ---`);
        }
      }
    }

    if (foundLinks.length) {
      console.log(`--- [DEBUG] Enlaces finales extraídos para ${url}: ${JSON.stringify(foundLinks)} ---`);
      return foundLinks;
    }

    console.log('--- [DEBUG] No se encontraron enlaces directos, intentando descifrar... ---');

    const encryptedLinks = [];
    const linkMap = [];
    for (const langData of encryptedData) {
      const currentLanguage = langData.video_language || '';
      if (videoLanguage && currentLanguage !== videoLanguage) continue;

      for (const server of langData.sortedEmbeds || []) {
        const serverName = server.servername.toLowerCase();
        if (targetServers.length && !targetServers.includes(serverName)) continue;

        encryptedLinks.push(server.link);
        linkMap.push({
          language: currentLanguage,
          server: server.servername,
          type: server.type
        });
      }
    }

    console.log(`--- [DEBUG] Enlaces cifrados a descifrar: ${encryptedLinks.length} ---`);
    if (!encryptedLinks.length) {
      return [];
    }

    const result = await page.evaluate((encryptedLinks) => {
      if (typeof decryptLinks === 'undefined') return { error: 'decryptLinks function not found' };
      return decryptLinks(encryptedLinks);
    }, encryptedLinks);

    console.log(`--- [DEBUG] Resultado del descifrado (crudo): ${JSON.stringify(result)} ---`);

    if (!result || result.error || !Array.isArray(result) || !result.length) {
      console.error('--- [DEBUG] ERROR en descifrado ---');
      return [];
    }

    result.forEach((decryptedLink, i) => {
      const info = linkMap[i];
      let videoLink = '';
      if (typeof decryptedLink === 'object') videoLink = decryptedLink.link;
      else if (Array.isArray(decryptedLink) && decryptedLink.length) videoLink = decryptedLink[0];
      else if (typeof decryptedLink === 'string') videoLink = decryptedLink;

      if (videoLink) {
        foundLinks.push({
          server: info.server.toLowerCase(),
          link: videoLink,
          language: info.language
        });
      }
    });

    console.log(`--- [DEBUG] Enlaces finales extraídos para ${url}: ${JSON.stringify(foundLinks)} ---`);
    return foundLinks;
  } catch (e) {
    console.error(`--- [DEBUG] ERROR extrayendo de ${url}: ${e.message} ---`);
    return null;
  } finally {
    if (browser) {
      const pages = await browser.pages();
      for (const page of pages) {
        await page.close().catch(() => {});
      }
      await browser.close().catch(() => {});
    }
  }
}

async function getTmdbData(tmdbId, isSeries, language = 'es-ES') {
  console.log(`--- [DEBUG] Extrayendo datos de TMDB para ID: ${tmdbId} (Es serie: ${isSeries}, Idioma: ${language}) ---`);
  const mediaType = isSeries ? 'tv' : 'movie';
  const baseUrl = `https://api.themoviedb.org/3/${mediaType}/${tmdbId}`;

  try {
    const infoUrl = `${baseUrl}?api_key=${TMDB_API_KEY}&language=${language}`;
    const infoResponse = await axios.get(infoUrl, { timeout: 10000 });
    const description = infoResponse.data.overview || 'No hay descripción disponible';

    const imagesUrl = `${baseUrl}/images?api_key=${TMDB_API_KEY}&include_image_language=${language},null`;
    const imagesResponse = await axios.get(imagesUrl, { timeout: 10000 });
    const posters = imagesResponse.data.posters.map(p => `https://image.tmdb.org/t/p/original${p.file_path}`);
    const backdrops = imagesResponse.data.backdrops.map(b => `https://image.tmdb.org/t/p/original${b.file_path}`);

    let result = { description, posters, backdrops };

    if (isSeries) {
      const episodeImages = {};
      const seriesInfo = await getSeriesInfoFromTmdb(tmdbId);
      if (seriesInfo) {
        for (const seasonInfo of seriesInfo) {
          const seasonNum = seasonInfo.season;
          const seasonUrl = `${baseUrl}/season/${seasonNum}?api_key=${TMDB_API_KEY}&language=${language}`;
          const seasonResponse = await axios.get(seasonUrl, { timeout: 10000 });
          if (seasonResponse.status === 200) {
            const seasonData = seasonResponse.data;
            const seasonKey = `Temporada ${seasonNum}`;
            episodeImages[seasonKey] = {};
            seasonData.episodes.forEach(ep => {
              const epNum = ep.episode_number;
              const stillPath = ep.still_path;
              if (stillPath) {
                episodeImages[seasonKey][`Episodio ${epNum}`] = `https://image.tmdb.org/t/p/original${stillPath}`;
              }
            });
          }
        }
      }
      result.episode_images = episodeImages;
    }

    console.log(`--- [DEBUG] Datos TMDB extraídos: ${posters.length} posters, ${backdrops.length} backdrops ---`);
    return result;
  } catch (e) {
    console.error(`--- [DEBUG] ERROR consultando TMDB para datos: ${e.message} ---`);
    return null;
  }
}

function processLinksByServer(links) {
  if (!links || !links.length) return [];
  if (links[0].server) return links;

  return links.map(link => ({
    server: 'Desconocido',
    link,
    language: 'LAT'
  }));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/stop_extraction', (req, res) => {
  stopExtractionFlag = true;
  console.log('--- [DEBUG] STOP EXTRACTION solicitado por el usuario ---');
  res.json({ status: 'success', message: 'Detención solicitada' });
});

app.post('/extract', async (req, res) => {
  stopExtractionFlag = false;
  console.log('\n========= NUEVA PETICIÓN DE EXTRACCIÓN =========');
  const { tmdb_id, type, server: serversToExtract, video_language = 'LAT', extraction_mode = 'specific', season, episode, season_start, season_end } = req.body;
  const isSeries = type === 'series';

  console.log(`--- [DEBUG] Formulario recibido: TMDB_ID=${tmdb_id}, Type=${type}, Server=${serversToExtract}, Language=${video_language} ---`);
  console.log(`--- [DEBUG] Modo de extracción: ${extraction_mode}, Season=${season}, Episode=${episode}, Range=${season_start}-${season_end} ---`);

  if (!tmdb_id) return res.json({ status: 'error', message: 'El ID de TMDB es obligatorio.' });

  const imdbId = await getImdbIdFromTmdb(tmdb_id, isSeries);
  if (!imdbId) return res.json({ status: 'error', message: 'No se encontró el ID de IMDB para este título.' });

  const finalResults = {};
  const unavailableSeasons = [];

  if (isSeries) {
    const seriesData = await getSeriesInfoFromTmdb(tmdb_id);
    if (!seriesData) return res.json({ status: 'error', message: 'No se pudo obtener la información de los episodios.' });

    if (extraction_mode === 'specific') {
      const seasonNum = parseInt(season);
      const episodeNum = parseInt(episode);
      const episodeUrl = `https://embed69.com/f/${imdbId}-${seasonNum}x${episodeNum.toString().padStart(2, '0')}/`;
      const links = await extractLinksFromPage(episodeUrl, serversToExtract, video_language);
      if (links === null) unavailableSeasons.push(seasonNum);
      else finalResults[`Temporada ${seasonNum} Episodio ${episodeNum}`] = processLinksByServer(links);
    } else if (extraction_mode === 'full_season') {
      const seasonNum = parseInt(season);
      const seasonInfo = seriesData.find(s => s.season === seasonNum);
      if (!seasonInfo) return res.json({ status: 'error', message: 'Temporada no encontrada.' });
      for (let ep = 1; ep <= seasonInfo.episodes; ep++) {
        if (stopExtractionFlag) {
          return res.json({ status: 'stopped', message: 'Extracción detenida.', data: finalResults });
        }
        const episodeUrl = `https://embed69.com/f/${imdbId}-${seasonNum}x${ep.toString().padStart(2, '0')}/`;
        const links = await extractLinksFromPage(episodeUrl, serversToExtract, video_language);
        if (links === null) unavailableSeasons.push(seasonNum);
        else finalResults[`Temporada ${seasonNum} Episodio ${ep}`] = processLinksByServer(links);
      }
    } else if (extraction_mode === 'season_range') {
      const start = parseInt(season_start);
      const end = parseInt(season_end);
      for (const seasonInfo of seriesData) {
        const seasonNum = seasonInfo.season;
        if (seasonNum < start || seasonNum > end) continue;
        for (let ep = 1; ep <= seasonInfo.episodes; ep++) {
          if (stopExtractionFlag) {
            return res.json({ status: 'stopped', message: 'Extracción detenida.', data: finalResults });
          }
          const episodeUrl = `https://embed69.com/f/${imdbId}-${seasonNum}x${ep.toString().padStart(2, '0')}/`;
          const links = await extractLinksFromPage(episodeUrl, serversToExtract, video_language);
          if (links === null) unavailableSeasons.push(seasonNum);
          else finalResults[`Temporada ${seasonNum} Episodio ${ep}`] = processLinksByServer(links);
        }
      }
    }
  } else {
    const movieUrl = `https://embed69.com/f/${imdbId}/`;
    const links = await extractLinksFromPage(movieUrl, serversToExtract, video_language);
    if (links === null) return res.json({ status: 'error', message: 'Esta película no está disponible.' });
    finalResults['Película'] = processLinksByServer(links);
  }

  const responseData = { status: 'success', data: finalResults };
  if (unavailableSeasons.length) responseData.warning = `Las siguientes temporadas no están disponibles: ${unavailableSeasons.join(', ')}`;
  res.json(responseData);
});

app.post('/extract_tmdb', async (req, res) => {
  console.log('\n========= NUEVA PETICIÓN DE EXTRACCIÓN TMDB =========');
  const { tmdb_id, type, language = 'es-ES' } = req.body;
  const isSeries = type === 'series';

  if (!tmdb_id) return res.json({ status: 'error', message: 'El ID de TMDB es obligatorio.' });

  const tmdbData = await getTmdbData(tmdb_id, isSeries, language);
  if (!tmdbData) return res.json({ status: 'error', message: 'No se pudo obtener la información de TMDB.' });

  res.json({ status: 'success', data: tmdbData, is_series: isSeries });
});

app.get('/search_tmdb', async (req, res) => {
  const { query, type = 'multi' } = req.query;
  if (!query || query.length < 2) return res.json({ status: 'success', results: [] });

  let url;
  if (type === 'multi') url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=es-ES&query=${query}&page=1`;
  else if (type === 'movie') url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${query}&page=1`;
  else url = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&language=es-ES&query=${query}&page=1`;

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data;
    const results = data.results.slice(0, 10).filter(item => item.media_type !== 'person').map(item => {
      const mediaTypeResult = item.media_type || (type !== 'multi' ? type : 'movie');
      const title = item.title || item.name || 'Sin título';
      let year = '';
      if (item.release_date) year = item.release_date.slice(0, 4);
      else if (item.first_air_date) year = item.first_air_date.slice(0, 4);
      return {
        id: item.id,
        title,
        year,
        media_type: mediaTypeResult === 'tv' ? 'series' : 'movie',
        poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : null
      };
    });
    res.json({ status: 'success', results });
  } catch (e) {
    console.error(`--- [DEBUG] ERROR EN BÚSQUEDA TMDB: ${e.message} ---`);
    res.json({ status: 'error', message: e.message });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
