export default function Features() {
  const features = [
    {
      icon: 'ri-braces-line',
      title: 'Clean HTML Extraction',
      description: 'Extract pure HTML content from any website. Get clean, structured code without unnecessary scripts and styles.'
    },
    {
      icon: 'ri-shield-keyhole-line',
      title: 'Proxy Bypass System',
      description: 'Advanced multi-proxy system to bypass website blocks, CORS restrictions, and anti-bot protection.'
    },
    {
      icon: 'ri-zap-line',
      title: 'Lightning Fast',
      description: 'Multiple fallback methods ensure fast and reliable scraping. Direct connections with premium proxy fallbacks.'
    },
    {
      icon: 'ri-download-cloud-line',
      title: 'Easy Export',
      description: 'Copy HTML to clipboard or download as .html file with one click. No technical knowledge required.'
    },
    {
      icon: 'ri-global-line',
      title: 'Universal Compatibility',
      description: 'Works with virtually all public websites. Supports modern frameworks and dynamic content.'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Ethical Scraping',
      description: 'Respects robots.txt and follows ethical practices. We prioritize responsible data extraction.'
    }
  ];

  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">Why Choose Our Scraper?</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Built with advanced technology to handle the toughest scraping challenges. 
          Bypass blocks and get clean HTML from any website.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 shadow-md card-hover border border-gray-200 dark:border-gray-700">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <i className={`${feature.icon} text-3xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
