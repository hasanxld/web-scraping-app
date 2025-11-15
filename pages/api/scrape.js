import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Validate URL
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return res.status(400).json({ error: 'Invalid URL protocol. Only HTTP and HTTPS are supported.' });
    }

    // Add timeout and better error handling
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Resolve only if the status code is less than 400
      }
    });

    const $ = cheerio.load(response.data);
    
    // Remove unwanted elements
    $('script, style, noscript, meta, link').remove();
    
    // Get clean HTML
    const html = $.html();
    
    // Extract text content (limited)
    const text = $('body').text()
      .replace(/\s+/g, ' ')
      .replace(/\n/g, ' ')
      .trim()
      .substring(0, 10000); // Limit text length
    
    // Extract links (limited)
    const links = [];
    $('a').each((i, element) => {
      if (links.length >= 20) return false; // Limit to 20 links
      const href = $(element).attr('href');
      const text = $(element).text().trim().substring(0, 100);
      if (href && text && href.startsWith('http')) {
        links.push({ href, text });
      }
    });

    // Extract images (limited)
    const images = [];
    $('img').each((i, element) => {
      if (images.length >= 10) return false; // Limit to 10 images
      const src = $(element).attr('src');
      const alt = $(element).attr('alt') || 'No alt text';
      if (src) {
        images.push({ src, alt });
      }
    });

    // Get metadata
    const title = $('title').text() || 'No title found';
    const description = $('meta[name="description"]').attr('content') || 'No description found';
    const keywords = $('meta[name="keywords"]').attr('content') || 'No keywords found';

    return res.status(200).json({
      success: true,
      data: {
        url,
        title,
        description,
        keywords,
        text,
        html: html.substring(0, 50000), // Limit HTML size
        links,
        images,
        scrapedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Scraping error:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ 
        success: false, 
        error: 'Request timeout - The website took too long to respond' 
      });
    } else if (error.response) {
      return res.status(error.response.status).json({ 
        success: false, 
        error: `Website returned error: ${error.response.status} ${error.response.statusText}` 
      });
    } else if (error.request) {
      return res.status(503).json({ 
        success: false, 
        error: 'Cannot connect to the website. It may be down or blocking our requests.' 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        error: 'An unexpected error occurred while scraping the website' 
      });
    }
  }
}
