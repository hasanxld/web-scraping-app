export default function Features() {
  const features = [
    {
      icon: 'ri-code-s-slash-line',
      title: 'No Coding Required',
      description: 'Extract data without technical knowledge. Our intuitive interface makes web scraping accessible to everyone.'
    },
    {
      icon: 'ri-layout-masonry-line',
      title: 'Structured Data Export',
      description: 'Get clean, organized data in multiple formats. Export as HTML, text, or structured JSON for easy analysis.'
    },
    {
      icon: 'ri-cloud-line',
      title: 'Cloud-Based Processing',
      description: 'Access from anywhere with an internet connection. No software installation or setup required.'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Ethical Scraping',
      description: 'Respects robots.txt and follows ethical practices. We prioritize website owners guidelines and terms of service.'
    },
    {
      icon: 'ri-zap-line',
      title: 'Lightning Fast',
      description: 'Optimized algorithms ensure quick data extraction. Process multiple pages simultaneously for efficiency.'
    },
    {
      icon: 'ri-global-line',
      title: 'Universal Compatibility',
      description: 'Works with virtually any public website. Supports modern JavaScript frameworks and dynamic content.'
    }
  ];

  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Powerful Features</h2>
        <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
          Our web scraping tool comes packed with advanced features to make data extraction simple, efficient, and reliable for everyone.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 p-6 shadow-md card-hover">
              <div className="text-primary-600 dark:text-primary-400 mb-4">
                <i className={`${feature.icon} text-3xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
                        }
