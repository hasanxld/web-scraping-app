'use client';
import { useState } from 'react';

export default function ScrapingTool() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to scrape website. Please try a different URL.');
      }
    } catch (err) {
      setError('Network error: Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.html) {
      navigator.clipboard.writeText(result.html);
      alert('✅ HTML copied to clipboard!');
    }
  };

  const downloadHTML = () => {
    if (result?.html) {
      const blob = new Blob([result.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scraped-${new Date().getTime()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Popular website suggestions
  const popularSites = [
    { name: 'Example', url: 'https://example.com' },
    { name: 'HTTPBin', url: 'https://httpbin.org/html' },
    { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Web_scraping' },
    { name: 'GitHub', url: 'https://github.com' }
  ];

  return (
    <section id="tool" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Web Scraping Tool</h2>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL (e.g., example.com or https://example.com)" 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 transition-colors min-w-[140px] flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="circular-loader mr-2"></div>
                      Scraping...
                    </>
                  ) : (
                    'Scrape HTML'
                  )}
                </button>
              </div>
              
              {/* Popular Sites Quick Links */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try these popular sites:</p>
                <div className="flex flex-wrap gap-2">
                  {popularSites.map((site, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setUrl(site.url)}
                      className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 transition-colors"
                    >
                      {site.name}
                    </button>
                  ))}
                </div>
              </div>
            </form>
            
            {loading && (
              <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="circular-loader"></div>
                  <div className="text-center">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">Scraping website HTML...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Using premium proxy system to bypass blocks
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-4">
                <div className="flex items-start">
                  <i className="ri-error-warning-line text-red-500 text-xl mr-3 mt-0.5"></i>
                  <div>
                    <p className="text-red-800 dark:text-red-200 font-semibold">{error}</p>
                    <p className="text-red-600 dark:text-red-300 text-sm mt-2">
                      💡 <strong>Tips:</strong> Try a different website, check if the URL is correct, or wait a moment and try again.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {result && (
              <div className="space-y-6">
                {/* Success Message */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                  <div className="flex items-center">
                    <i className="ri-checkbox-circle-line text-green-500 text-xl mr-2"></i>
                    <div>
                      <p className="text-green-800 dark:text-green-200 font-semibold">
                        ✅ Successfully scraped HTML content!
                      </p>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Method used: <span className="font-mono bg-green-100 dark:bg-green-800 px-2 py-1">{result.method}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Website Info */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Website Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">URL:</span>
                      <span className="text-blue-600 dark:text-blue-400 break-all">{result.url}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">Title:</span>
                      <span className="text-gray-800 dark:text-white">{result.title}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">Description:</span>
                      <span className="text-gray-800 dark:text-white">{result.description}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">Content Size:</span>
                      <span className="text-gray-800 dark:text-white">{result.contentLength} characters</span>
                    </div>
                  </div>
                </div>

                {/* HTML Content */}
                <div className="border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">HTML Content</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Clean HTML extracted from the website
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={copyToClipboard}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        title="Copy HTML"
                      >
                        <i className="ri-file-copy-line"></i>
                        <span>Copy</span>
                      </button>
                      <button 
                        onClick={downloadHTML}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
                        title="Download HTML"
                      >
                        <i className="ri-download-line"></i>
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                  <textarea 
                    value={result.html} 
                    readOnly
                    className="w-full h-96 p-4 border-0 bg-white dark:bg-gray-800 dark:text-white focus:outline-none resize-none overflow-auto font-mono text-xs leading-relaxed"
                    placeholder="HTML content will appear here..."
                  />
                </div>

                {/* Preview */}
                <div className="border border-gray-200 dark:border-gray-600">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Live Preview</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      How the HTML looks when rendered (basic styling)
                    </p>
                  </div>
                  <div 
                    className="w-full h-64 p-4 bg-white dark:bg-gray-800 overflow-auto"
                    dangerouslySetInnerHTML={{ __html: result.html }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white dark:bg-gray-800 p-6 shadow-md">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <i className="ri-shield-keyhole-line text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Proxy Bypass</h3>
              <p className="text-gray-600 dark:text-gray-400">Advanced proxy system to bypass website blocks and restrictions</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 shadow-md">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <i className="ri-braces-line text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Clean HTML</h3>
              <p className="text-gray-600 dark:text-gray-400">Get clean, structured HTML content without scripts and styles</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 shadow-md">
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <i className="ri-zap-line text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Fast & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-400">Multiple fallback methods ensure successful scraping</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
    }
