'use client';
import { useState } from 'react';

export default function ScrapingTool() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to scrape website');
      }
    } catch (err) {
      setError('An error occurred while scraping the website');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.html) {
      navigator.clipboard.writeText(result.html);
      alert('HTML copied to clipboard!');
    }
  };

  const downloadHTML = () => {
    if (result?.html) {
      const blob = new Blob([result.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scraped-content-${new Date().getTime()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <section id="tool" className="py-16 bg-slate-50 dark:bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Web Scraping Tool</h2>
          
          <div className="bg-white dark:bg-slate-900 shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <input 
                    type="url" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL (e.g., https://example.com)" 
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500" 
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-8 transition-colors"
                >
                  {loading ? 'Scraping...' : 'Scrape Data'}
                </button>
              </div>
            </form>
            
            {loading && (
              <div className="text-center py-12">
                <div className="loading-dots mx-auto mb-4">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <p className="text-lg">Scraping website data...</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 mb-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
            
            {result && (
              <div>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl font-semibold">Scraped Content</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <i className="ri-file-copy-line"></i>
                    </button>
                    <button 
                      onClick={downloadHTML}
                      className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <i className="ri-download-line"></i>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Title:</h4>
                    <p className="text-slate-600 dark:text-slate-400">{result.title}</p>
                  </div>
                  
                  {result.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Description:</h4>
                      <p className="text-slate-600 dark:text-slate-400">{result.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-semibold mb-2">Text Content:</h4>
                    <textarea 
                      value={result.text} 
                      readOnly
                      className="w-full h-40 p-4 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none resize-none overflow-auto"
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">HTML Content:</h4>
                    <textarea 
                      value={result.html} 
                      readOnly
                      className="w-full h-96 p-4 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:outline-none resize-none overflow-auto font-mono text-sm"
                    />
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
