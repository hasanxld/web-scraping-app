import Head from 'next/head';
import Header from '../components/Header';
import ScrapingTool from '../components/ScrapingTool';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>SCRAPING | Advanced Web Data Extraction Tool</title>
        <meta name="description" content="Extract web data with our powerful scraping tool. No coding required. Fast, secure, and easy to use web scraping service." />
        <meta name="keywords" content="web scraping, data extraction, web data, scraping tool, data mining" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourdomain.com" />
        <meta property="og:title" content="SCRAPING | Advanced Web Data Extraction Tool" />
        <meta property="og:description" content="Extract web data with our powerful scraping tool. No coding required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SCRAPING | Web Data Extraction Tool" />
        <meta name="twitter:description" content="Extract web data with our powerful scraping tool." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        
        {/* Hero Section */}
        <section className="gradient-bg text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Extract Web Data with Ease</h1>
              <p className="text-xl mb-10 opacity-90">Our powerful web scraping tool helps you collect data from any website in seconds. No coding required.</p>
              <a href="#tool" className="inline-block bg-white text-primary-600 font-semibold py-3 px-8 hover:bg-slate-100 transition-colors">
                Try It Now
              </a>
            </div>
          </div>
        </section>

        <ScrapingTool />
        <Features />
        <Reviews />
      </main>

      <Footer />
    </>
  );
}
