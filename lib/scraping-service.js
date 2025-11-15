const axios = require('axios');
const cheerio = require('cheerio');

// Premium Proxy List (Rotating Proxies)
const premiumProxies = [
  {
    protocol: 'http',
    host: '45.77.56.114',
    port: 3128,
    country: 'US'
  },
  {
    protocol: 'http',
    host: '51.158.68.68',
    port: 8811,
    country: 'FR'
  },
  {
    protocol: 'http',
    host: '185.199.229.156',
    port: 7492,
    country: 'US'
  },
  {
    protocol: 'http',
    host: '185.199.228.220',
    port: 7300,
    country: 'US'
  },
  {
    protocol: 'http',
    host: '185.199.231.45',
    port: 8382,
    country: 'US'
  }
];

// Random User Agents
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
];

class PremiumScrapingService {
  constructor() {
    this.currentProxyIndex = 0;
    this.currentUserAgentIndex = 0;
  }

  getRandomUserAgent() {
    this.currentUserAgentIndex = (this.currentUserAgentIndex + 1) % userAgents.length;
    return userAgents[this.currentUserAgentIndex];
  }

  getNextProxy() {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % premiumProxies.length;
    return premiumProxies[this.currentProxyIndex];
  }

  async scrapeWithAdvancedTechniques(url) {
    const userAgent = this.getRandomUserAgent();
    const proxy = this.getNextProxy();
    
    console.log(`Scraping ${url} with User-Agent: ${userAgent.substring(0, 50)}...`);
    console.log(`Using proxy: ${proxy.host}:${proxy.port}`);

    const axiosConfig = {
      method: 'GET',
      url: url,
      timeout: 30000,
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
      },
      // Proxy configuration
      proxy: {
        protocol: proxy.protocol,
        host: proxy.host,
        port: proxy.port
      },
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      },
      maxRedirects: 5
    };

    try {
      // First attempt with proxy
      const response = await axios(axiosConfig);
      return this.processContent(response.data, url);
    } catch (proxyError) {
      console.log('Proxy failed, trying direct connection...');
      
      // Fallback to direct connection without proxy
      try {
        const directResponse = await axios({
          ...axiosConfig,
          proxy: false
        });
        return this.processContent(directResponse.data, url);
      } catch (directError) {
        console.log('Direct connection failed, trying CORS proxy...');
        
        // Final fallback - CORS proxy
        try {
          const corsResponse = await axios({
            method: 'GET',
            url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            timeout: 25000
          });
          
          if (corsResponse.data && corsResponse.data.contents) {
            return this.processContent(corsResponse.data.contents, url);
          }
          throw new Error('CORS proxy returned no content');
        } catch (corsError) {
          throw new Error(`All scraping methods failed: ${corsError.message}`);
        }
      }
    }
  }

  processContent(html, url) {
    const $ = cheerio.load(html);
    
    // Remove unwanted elements but keep structure
    $('script, style, noscript, meta, link, svg, iframe, form, nav, footer, header').remove();
    
    // Extract comprehensive data
    return {
      success: true,
      data: {
        // Basic Info
        url: url,
        title: $('title').text() || 'No title found',
        description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || 'No description found',
        
        // Full Content
        fullHtml: $.html().substring(0, 100000), // Limited size
        cleanText: this.extractCleanText($),
        
        // Structured Data
        headings: this.extractHeadings($),
        paragraphs: this.extractParagraphs($),
        lists: this.extractLists($),
        tables: this.extractTables($),
        
        // Links & Media
        links: this.extractLinks($, url),
        images: this.extractImages($, url),
        
        // Metadata
        metadata: this.extractMetadata($),
        language: $('html').attr('lang') || 'en',
        
        // Statistics
        wordCount: this.countWords($),
        scrapedAt: new Date().toISOString()
      }
    };
  }

  extractCleanText($) {
    let text = $('body').text()
      .replace(/\s+/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/[^\w\s.,!?;:()-]/g, '')
      .trim();
    
    return text.substring(0, 10000); // Limit text length
  }

  extractHeadings($) {
    const headings = [];
    $('h1, h2, h3, h4, h5, h6').each((i, element) => {
      const text = $(element).text().trim();
      if (text) {
        headings.push({
          level: element.name,
          text: text,
          id: $(element).attr('id') || null
        });
      }
    });
    return headings.slice(0, 50); // Limit to 50 headings
  }

  extractParagraphs($) {
    const paragraphs = [];
    $('p').each((i, element) => {
      const text = $(element).text().trim();
      if (text && text.length > 10) { // Only meaningful paragraphs
        paragraphs.push(text);
      }
    });
    return paragraphs.slice(0, 100); // Limit to 100 paragraphs
  }

  extractLists($) {
    const lists = [];
    $('ul, ol').each((i, element) => {
      const items = [];
      $(element).find('li').each((j, li) => {
        const text = $(li).text().trim();
        if (text) items.push(text);
      });
      if (items.length > 0) {
        lists.push({
          type: element.name,
          items: items.slice(0, 20) // Limit items per list
        });
      }
    });
    return lists.slice(0, 20); // Limit to 20 lists
  }

  extractTables($) {
    const tables = [];
    $('table').each((i, table) => {
      const rows = [];
      $(table).find('tr').each((j, row) => {
        const cells = [];
        $(row).find('td, th').each((k, cell) => {
          cells.push($(cell).text().trim());
        });
        if (cells.length > 0) rows.push(cells);
      });
      if (rows.length > 0) {
        tables.push({
          rows: rows.slice(0, 10) // Limit rows per table
        });
      }
    });
    return tables.slice(0, 10); // Limit to 10 tables
  }

  extractLinks($, baseUrl) {
    const links = [];
    $('a').each((i, element) => {
      if (links.length >= 50) return false; // Limit to 50 links
      
      let href = $(element).attr('href');
      const text = $(element).text().trim().substring(0, 200);
      
      if (href) {
        // Convert relative URLs to absolute
        try {
          if (href.startsWith('/')) {
            href = new URL(href, baseUrl).href;
          } else if (href.startsWith('./')) {
            href = new URL(href.substring(1), baseUrl).href;
          } else if (href.startsWith('#')) {
            href = baseUrl + href;
          } else if (!href.startsWith('http')) {
            href = new URL(href, baseUrl).href;
          }
        } catch (e) {
          // Skip invalid URLs
          return;
        }

        if (href && href.startsWith('http')) {
          links.push({
            text: text || 'No text',
            href: href,
            isExternal: !href.includes(new URL(baseUrl).hostname)
          });
        }
      }
    });
    return links;
  }

  extractImages($, baseUrl) {
    const images = [];
    $('img').each((i, element) => {
      if (images.length >= 30) return false; // Limit to 30 images
      
      let src = $(element).attr('src');
      const alt = $(element).attr('alt') || 'No alt text';
      const title = $(element).attr('title') || '';
      
      if (src) {
        // Convert relative image URLs to absolute
        try {
          if (src.startsWith('/')) {
            src = new URL(src, baseUrl).href;
          } else if (src.startsWith('./')) {
            src = new URL(src.substring(1), baseUrl).href;
          } else if (!src.startsWith('http')) {
            src = new URL(src, baseUrl).href;
          }
        } catch (e) {
          // Skip invalid URLs
          return;
        }

        if (src && src.startsWith('http')) {
          images.push({
            src: src,
            alt: alt,
            title: title,
            dimensions: $(element).attr('width') && $(element).attr('height') 
              ? { width: $(element).attr('width'), height: $(element).attr('height') }
              : null
          });
        }
      }
    });
    return images;
  }

  extractMetadata($) {
    const metadata = {};
    
    // Open Graph metadata
    $('meta[property^="og:"]').each((i, element) => {
      const property = $(element).attr('property');
      const content = $(element).attr('content');
      if (property && content) {
        metadata[property] = content;
      }
    });
    
    // Twitter metadata
    $('meta[name^="twitter:"]').each((i, element) => {
      const name = $(element).attr('name');
      const content = $(element).attr('content');
      if (name && content) {
        metadata[name] = content;
      }
    });
    
    // Other important meta tags
    const importantMeta = ['keywords', 'author', 'viewport', 'robots'];
    importantMeta.forEach(metaName => {
      const content = $(`meta[name="${metaName}"]`).attr('content');
      if (content) metadata[metaName] = content;
    });
    
    return metadata;
  }

  countWords($) {
    const text = $('body').text();
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
}

module.exports = PremiumScrapingService;
