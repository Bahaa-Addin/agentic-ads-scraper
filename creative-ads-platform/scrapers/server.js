#!/usr/bin/env node

/**
 * Creative Ads Scraper - HTTP Server
 * 
 * Provides an HTTP API for triggering scraping jobs,
 * designed for Cloud Run deployment.
 */

import http from 'http';
import { URL } from 'url';
import { createScraper } from './scraper.js';
import { logger, formatOutput, formatError } from './utils.js';

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

/**
 * Parse JSON body from request
 */
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Send JSON response
 */
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

/**
 * Handle scraping request
 */
async function handleScrape(req, res) {
  const startTime = Date.now();
  let scraper = null;

  try {
    const body = await parseBody(req);
    
    const {
      source = 'meta_ad_library',
      query = null,
      filters = {},
      maxItems = 100
    } = body;

    logger.info('Starting scrape job', { source, query, maxItems });

    scraper = createScraper(source);
    await scraper.initialize();

    const assets = await scraper.scrape(query, { ...filters, maxItems });

    const processingTime = Date.now() - startTime;
    const output = formatOutput(assets, {
      source,
      query,
      processingTime,
      errors: scraper.errors
    });

    logger.info('Scrape job completed', {
      source,
      count: assets.length,
      processingTime
    });

    sendJson(res, 200, output);

  } catch (error) {
    logger.error('Scrape job failed', { error: error.message });
    const output = formatError(error, { source: 'unknown' });
    sendJson(res, 500, output);
  } finally {
    if (scraper) {
      await scraper.close();
    }
  }
}

/**
 * Health check handler
 */
function handleHealth(req, res) {
  sendJson(res, 200, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}

/**
 * Main request handler
 */
async function handleRequest(req, res) {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  logger.debug(`${method} ${path}`);

  // CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    switch (true) {
      case path === '/health' && method === 'GET':
        handleHealth(req, res);
        break;

      case path === '/scrape' && method === 'POST':
        await handleScrape(req, res);
        break;

      case path === '/sources' && method === 'GET':
        sendJson(res, 200, {
          sources: [
            'meta_ad_library',
            'google_ads_transparency',
            'internet_archive',
            'wikimedia_commons'
          ]
        });
        break;

      default:
        sendJson(res, 404, { error: 'Not found' });
    }
  } catch (error) {
    logger.error('Request handler error', { error: error.message });
    sendJson(res, 500, { error: 'Internal server error' });
  }
}

/**
 * Start the server
 */
const server = http.createServer(handleRequest);

server.listen(PORT, HOST, () => {
  logger.info(`Scraper server listening on ${HOST}:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down...');
  server.close(() => {
    process.exit(0);
  });
});

export default server;

