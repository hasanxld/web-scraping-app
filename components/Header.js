'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">SCRAPING</h1>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link href="/about" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            About
          </Link>
          <Link href="/contact" className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <i className="ri-moon-line text-xl text-gray-700"></i>
            ) : (
              <i className="ri-sun-line text-xl text-yellow-400"></i>
            )}
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            <i className="ri-menu-line text-xl text-gray-700 dark:text-gray-300"></i>
          </button>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
              }
