import PremiumScrapingService from '../../lib/scraping-service';

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

    // Validate URL format
    new URL(targetUrl);

    // Use premium scraping service
    const scrapingService = new PremiumScrapingService();
    const result = await scrapingService.scrapeWithAdvancedTechniques(targetUrl);

    res.status(200).json(result);

  } catch (error) {
    console.error('Premium scraping error:', error.message);

    // User-friendly error messages
    let userMessage = 'Failed to scrape website. The site might be blocking automated requests.';
    
    if (error.message.includes('Invalid URL')) {
      userMessage = 'Please enter a valid website URL.';
    } else if (error.message.includes('timeout') || error.message.includes('TIMEDOUT')) {
      userMessage = 'Website took too long to respond. Please try again.';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      userMessage = 'Cannot connect to the website. Please check the URL and try again.';
    } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
      userMessage = 'Website blocked our request. Try a different website.';
    } else if (error.message.includes('404') || error.message.includes('Not Found')) {
      userMessage = 'Website not found. Please check the URL.';
    }

    res.status(500).json({
      success: false,
      error: userMessage,
      technicalError: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
