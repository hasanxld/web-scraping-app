export default function Reviews() {
  const reviews = [
    {
      initials: 'JD',
      name: 'John Doe',
      role: 'Data Analyst',
      content: 'This tool has revolutionized how we collect market data. The accuracy and speed are impressive, saving us countless hours of manual work.',
      rating: 5
    },
    {
      initials: 'SJ',
      name: 'Sarah Johnson',
      role: 'Market Researcher',
      content: 'As a researcher, I need reliable data sources. This scraping tool delivers consistent results across different websites with minimal setup.',
      rating: 5
    },
    {
      initials: 'MR',
      name: 'Michael Roberts',
      role: 'SEO Specialist',
      content: 'Perfect for competitive analysis and tracking SEO metrics. The structured data output integrates seamlessly with our analytics pipeline.',
      rating: 4
    },
    {
      initials: 'ET',
      name: 'Emily Thompson',
      role: 'Academic Researcher',
      content: 'Essential for my research projects. Being able to extract data without programming knowledge has been a game-changer for our team.',
      rating: 5
    },
    {
      initials: 'AK',
      name: 'Alex Kim',
      role: 'Product Manager',
      content: 'The intuitive interface makes it easy for non-technical team members to gather the data they need. Support is responsive and helpful.',
      rating: 5
    },
    {
      initials: 'LW',
      name: 'Lisa Wang',
      role: 'Digital Marketer',
      content: 'Great for monitoring competitor pricing and product information. The scheduled scraping feature keeps our data always up-to-date.',
      rating: 4
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`${i < rating ? 'ri-star-fill' : 'ri-star-line'} text-amber-400`}
      ></i>
    ));
  };

  return (
    <section id="reviews" className="py-16 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Trusted by Thousands</h2>
        <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
          Join thousands of professionals who rely on our web scraping tool for their data extraction needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 p-6 shadow-md card-hover">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg mr-4">
                  {review.initials}
                </div>
                <div>
                  <h4 className="font-semibold">{review.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{review.role}</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">{review.content}</p>
              <div className="flex">
                {renderStars(review.rating)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
                       }
