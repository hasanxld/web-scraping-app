import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-gradient text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">SCRAPING</h3>
            <p className="text-slate-300 mb-4">
              The most powerful and user-friendly web scraping tool on the market.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <i className="ri-twitter-fill text-xl"></i>
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <i className="ri-linkedin-fill text-xl"></i>
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors">
                <i className="ri-github-fill text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-300 hover:text-white transition-colors">Web Scraper</Link></li>
              <li><a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="#reviews" className="text-slate-300 hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-slate-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-700 text-center text-slate-400">
          <p>&copy; 2023 SCRAPING. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
    }
