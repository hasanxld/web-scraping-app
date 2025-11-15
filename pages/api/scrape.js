import axios from 'axios';
import * as cheerio from 'cheerio';

const PROXY_CONFIG = {
  proxies: [
    {
      name: 'cors-anywhere',
      url: (targetUrl) => `https://cors-anywhere.herokuapp.com/${targetUrl}`
    },
    {
      name: 'allorigins',
      url: (targetUrl) => `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
    },
    {
      name: 'cors-proxy',
      url: (targetUrl) => `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
    }
  ],
  
  directHeaders: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"'
  }
};

async function tryDirectRequest(url) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      timeout: 10000,
      headers: PROXY_CONFIG.directHeaders,
      validateStatus: function (status) {
        return status < 400;
      }
    });
    return { success: true, data: response.data, method: 'direct' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function tryProxyRequest(url, proxy) {
  try {
    const proxyUrl = proxy.url(url);
    const response = await axios({
      method: 'GET',
      url: proxyUrl,
      timeout: 15000,
      headers: {
        'User-Agent': PROXY_CONFIG.directHeaders['User-Agent'],
        'Accept': PROXY_CONFIG.directHeaders['Accept']
      }
    });
    return { success: true, data: response.data, method: proxy.name };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function scrapeWithFallback(url) {
  const directResult = await tryDirectRequest(url);
  if (directResult.success) {
    return directResult;
  }

  for (const proxy of PROXY_CONFIG.proxies) {
    const proxyResult = await tryProxyRequest(url, proxy);
    if (proxyResult.success) {
      return proxyResult;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return { success: true, data: response.data, method: 'fallback' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default async function handler(req, res) {
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
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    new URL(targetUrl);

    const scrapeResult = await scrapeWithFallback(targetUrl);
    
    if (!scrapeResult.success) {
      throw new Error(`All scraping methods failed: ${scrapeResult.error}`);
    }

    const $ = cheerio.load(scrapeResult.data);

    $('script, style, noscript, meta, link, svg, iframe, form, input, button, nav, footer, header').remove();

    $('*').each(function() {
      const $el = $(this);
      if ($el.children().length === 0 && $el.text().trim() === '') {
        $el.remove();
      }
    });

    const cleanedHtml = $.html()
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();

    const title = $('title').text() || 'No title found';
    const description = $('meta[name="description"]').attr('content') || 'No description found';

    res.status(200).json({
      success: true,
      data: {
        url: targetUrl,
        title,
        description,
        html: cleanedHtml.substring(0, 100000),
        scrapedAt: new Date().toISOString(),
        method: scrapeResult.method,
        contentLength: cleanedHtml.length
      }
    });

  } catch (error) {
    let userMessage = 'Failed to scrape website';
    
    if (error.message.includes('blocked') || error.message.includes('403')) {
      userMessage = 'Website blocked our request. Try a different website.';
    } else if (error.message.includes('timeout') || error.name === 'TimeoutError') {
      userMessage = 'Website took too long to respond. Please try again.';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      userMessage = 'Website not found. Please check the URL.';
    } else if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
      userMessage = 'Website blocked cross-origin requests. Try a different website.';
    } else if (error.message.includes('SSL') || error.message.includes('certificate')) {
      userMessage = 'SSL certificate error. The website may be insecure.';
    } else if (error.message.includes('Invalid URL')) {
      userMessage = 'Please enter a valid website URL.';
    }

    res.status(500).json({
      success: false,
      error: userMessage,
      technicalError: error.message
    });
  }
}
