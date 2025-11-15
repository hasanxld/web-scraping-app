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

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  const downloadContent = (content, filename) => {
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
                    'Scrape Data'
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Try popular sites like: example.com, httpbin.org, or any public website
              </p>
            </form>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-4">
                <div className="flex items-center">
                  <i className="ri-error-warning-line text-red-500 text-xl mr-2"></i>
                  <div>
                    <p className="text-red-800 dark:text-red-200 font-semibold">{error}</p>
                    <p className="text-red-600 dark:text-red-300 text-sm mt-1">
                      Tip: Try a different website or check if the URL is correct.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {result && (
              <div className="space-y-6">
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
                      <span className="font-semibold text-gray-600 dark:text-gray-300">Content Length:</span>
                      <span className="text-gray-800 dark:text-white">{result.contentLength} characters</span>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Text Content</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => copyToClipboard(result.text)}
                        className="p-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-gray-300"
                        title="Copy text"
                      >
                        <i className="ri-file-copy-line"></i>
                      </button>
                      <button 
                        onClick={() => downloadContent(result.text, 'scraped-text.txt')}
                        className="p-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-gray-300"
                        title="Download text"
                      >
                        <i className="ri-download-line"></i>
                      </button>
                    </div>
                  </div>
                  <textarea 
                    value={result.text} 
                    readOnly
                    className="w-full h-40 p-4 border-0 bg-white dark:bg-gray-800 dark:text-white focus:outline-none resize-none overflow-auto text-sm"
                  />
                </div>

                {/* HTML Content */}
                <div className="border border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">HTML Content</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => copyToClipboard(result.html)}
                        className="p-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-gray-300"
                        title="Copy HTML"
                      >
                        <i className="ri-file-copy-line"></i>
                      </button>
                      <button 
                        onClick={() => downloadContent(result.html, 'scraped-html.html')}
                        className="p-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-gray-300"
                        title="Download HTML"
                      >
                        <i className="ri-download-line"></i>
                      </button>
                    </div>
                  </div>
                  <textarea 
                    value={result.html} 
                    readOnly
                    className="w-full h-96 p-4 border-0 bg-white dark:bg-gray-800 dark:text-white focus:outline-none resize-none overflow-auto font-mono text-xs"
                  />
                </div>

                {/* Links & Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 dark:border-gray-600">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Found Links ({result.links.length})
                      </h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-4 bg-white dark:bg-gray-800">
                      {result.links.length > 0 ? (
                        result.links.map((link, index) => (
                          <div key={index} className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                            <a 
                              href={link.href} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 dark:text-blue-400 hover:underline break-all text-sm font-medium"
                            >
                              {link.text || 'No text'}
                            </a>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                              {link.href}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No links found</p>
                      )}
                    </div>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-600">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Found Images ({result.images.length})
                      </h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-4 bg-white dark:bg-gray-800">
                      {result.images.length > 0 ? (
                        result.images.map((image, index) => (
                          <div key={index} className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                            <div className="text-xs text-blue-600 dark:text-blue-400 break-all mb-1">
                              {image.src}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Alt: {image.alt}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No images found</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
