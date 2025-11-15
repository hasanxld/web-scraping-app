import Head from 'next/head';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../components/Header'), { ssr: true });
const Footer = dynamic(() => import('../components/Footer'), { ssr: true });

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | SCRAPING - Web Data Extraction Tool</title>
        <meta name="description" content="Learn about SCRAPING - our mission to make web data extraction accessible to everyone without coding knowledge." />
        <meta name="keywords" content="about scraping, web data extraction, our mission, company info" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">About SCRAPING</h1>
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  SCRAPING was founded with a simple mission: to make web data extraction accessible to everyone, 
                  regardless of their technical background.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">Our Story</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  In today's data-driven world, access to web data is crucial for businesses, researchers, and developers. 
                  However, traditional web scraping methods often require programming knowledge and technical expertise, 
                  creating barriers for many potential users.
                </p>
                
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  We recognized this gap and set out to create a solution that combines powerful data extraction capabilities 
                  with an intuitive, user-friendly interface. Our team of developers and data experts worked tirelessly to 
                  build a tool that delivers professional-grade results without the complexity.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-800 p-6">
                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
                      <i className="ri-shield-check-line mr-2"></i>
                      Ethical Practices
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">We prioritize ethical web scraping, respecting robots.txt files and website terms of service.</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-6">
                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
                      <i className="ri-user-line mr-2"></i>
                      User-First Approach
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">Every feature is designed with our users in mind, ensuring simplicity without sacrificing power.</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-6">
                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
                      <i className="ri-lightbulb-line mr-2"></i>
                      Innovation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">We continuously improve our technology to handle modern websites and complex data structures.</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-6">
                    <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
                      <i className="ri-team-line mr-2"></i>
                      Accessibility
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">We believe powerful tools should be available to everyone, not just technical experts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
                        }
