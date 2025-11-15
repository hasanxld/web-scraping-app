const axios = require('axios');
const cheerio = require('cheerio');

export async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Remove script and style tags
    $('script, style, noscript').remove();
    
    // Get clean HTML
    const html = $.html();
    
    // Extract text content
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    
    // Extract links
    const links = [];
    $('a').each((i, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      if (href && text) {
        links.push({ href, text });
      }
    });

    // Extract images
    const images = [];
    $('img').each((i, element) => {
      const src = $(element).attr('src');
      const alt = $(element).attr('alt') || '';
      if (src) {
        images.push({ src, alt });
      }
    });

    return {
      success: true,
      data: {
        html,
        text: text.substring(0, 5000), // Limit text length
        links: links.slice(0, 50), // Limit number of links
        images: images.slice(0, 20), // Limit number of images
        title: $('title').text() || 'No title found',
        description: $('meta[name="description"]').attr('content') || 'No description found'
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
