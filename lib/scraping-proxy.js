const axios = require('axios');

// Free proxy list (rotating proxies)
const proxies = [
  // Add some free proxies (these might not be reliable, for demo only)
  // 'http://45.77.56.114:3128',
  // 'http://51.158.68.68:8811',
  // In production, use paid proxy services like:
  // - Bright Data
  // - Oxylabs
  // - ScraperAPI
];

export async function scrapeWithProxy(url) {
  const options = {
    method: 'GET',
    url: url,
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0'
    },
    validateStatus: function (status) {
      return status >= 200 && status < 400;
    }
  };

  // Try direct connection first
  try {
    console.log('Trying direct connection...');
    const response = await axios(options);
    return {
      success: true,
      data: response.data,
      method: 'direct'
    };
  } catch (directError) {
    console.log('Direct connection failed, trying CORS proxy...');
    
    // Fallback to CORS proxy
    try {
      const proxyResponse = await axios({
        ...options,
        url: `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        timeout: 20000
      });
      
      return {
        success: true,
        data: proxyResponse.data,
        method: 'cors-proxy'
      };
    } catch (proxyError) {
      console.log('CORS proxy failed, trying alternative method...');
      
      // Final fallback - simple request
      try {
        const simpleResponse = await axios({
          method: 'GET',
          url: url,
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        return {
          success: true,
          data: simpleResponse.data,
          method: 'simple'
        };
      } catch (finalError) {
        throw new Error(`All scraping methods failed: ${finalError.message}`);
      }
    }
  }
}
