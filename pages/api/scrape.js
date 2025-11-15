import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

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
    // Validate and format URL
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const urlObj = new URL(targetUrl);

    // Use server-side fetch with proper headers
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
      },
      // Add timeout
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, noscript, meta, link, svg, iframe, form').remove();

    // Get clean content
    const title = $('title').text() || 'No title found';
    const description = $('meta[name="description"]').attr('content') || 'No description found';
    
    // Clean text content
    let text = $('body').text()
      .replace(/\s+/g, ' ')
      .replace(/\n/g, ' ')
      .trim()
      .substring(0, 5000);

    // Extract links
    const links = [];
    $('a').each((i, element) => {
      if (links.length >= 15) return false;
      const href = $(element).attr('href');
      const text = $(element).text().trim().substring(0, 100);
      if (href && text) {
        // Convert relative URLs to absolute
        let absoluteHref = href;
        if (href.startsWith('/')) {
          absoluteHref = `${urlObj.origin}${href}`;
        } else if (href.startsWith('#')) {
          absoluteHref = `${targetUrl}${href}`;
        }
        links.push({ href: absoluteHref, text });
      }
    });

    // Extract images
    const images = [];
    $('img').each((i, element) => {
      if (images.length >= 10) return false;
      const src = $(element).attr('src');
      const alt = $(element).attr('alt') || 'No alt text';
      if (src) {
        // Convert relative image URLs to absolute
        let absoluteSrc = src;
        if (src.startsWith('/')) {
          absoluteSrc = `${urlObj.origin}${src}`;
        } else if (src.startsWith('./')) {
          absoluteSrc = `${urlObj.origin}${src.substring(1)}`;
        }
        images.push({ src: absoluteSrc, alt });
      }
    });

    // Get cleaned HTML
    const cleanedHtml = $.html().substring(0, 30000);

    res.status(200).json({
      success: true,
      data: {
        url: targetUrl,
        title,
        description,
        text,
        html: cleanedHtml,
        links,
        images,
        scrapedAt: new Date().toISOString(),
        contentLength: text.length
      }
    });

  } catch (error) {
    console.error('Scraping error:', error.message);

    // User-friendly error messages
    let userMessage = 'Failed to scrape website';
    
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      userMessage = 'Website took too long to respond. Please try again.';
    } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch failed')) {
      userMessage = 'Cannot connect to the website. It may be down or blocking our requests.';
    } else if (error.message.includes('Invalid URL')) {
      userMessage = 'Please enter a valid website URL.';
    } else if (error.message.includes('HTTP error')) {
      userMessage = 'Website returned an error. It may be blocking automated requests.';
    }

    res.status(500).json({
      success: false,
      error: userMessage,
      technicalError: error.message
    });
  }
}
