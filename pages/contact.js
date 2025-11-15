'use client';
import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(''), 5000);
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Contact Us | SCRAPING - Web Data Extraction Tool</title>
        <meta name="description" content="Get in touch with the SCRAPING team. We're here to help with your web scraping needs and answer any questions." />
        <meta name="keywords" content="contact scraping, support, help, questions" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-white dark:bg-slate-900">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
              <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
                Have questions about our web scraping tool? Need help with a specific project? 
                We're here to help you get the most out of our platform.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-slate-800 shadow-lg p-8">
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="What is this regarding?"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows="6"
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                          placeholder="Tell us how we can help you..."
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-8 transition-colors"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                      
                      {submitStatus === 'success' && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                          <p className="text-green-800 dark:text-green-200">
                            Thank you for your message! We'll get back to you soon.
                          </p>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-slate-50 dark:bg-slate-800 p-6">
                    <div className="text-primary-600 dark:text-primary-400 mb-4">
                      <i className="ri-mail-line text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                    <p className="text-slate-600 dark:text-slate-400">support@scraping.com</p>
                    <p className="text-slate-600 dark:text-slate-400">We typically respond within 24 hours</p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-6">
                    <div className="text-primary-600 dark:text-primary-400 mb-4">
                      <i className="ri-question-answer-line text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Help Center</h3>
                    <p className="text-slate-600 dark:text-slate-400">Check our documentation for common questions and tutorials</p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800 p-6">
                    <div className="text-primary-600 dark:text-primary-400 mb-4">
                      <i className="ri-time-line text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Support Hours</h3>
                    <p className="text-slate-600 dark:text-slate-400">Monday - Friday: 9AM - 6PM EST</p>
                    <p className="text-slate-600 dark:text-slate-400">Weekend: Emergency support only</p>
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
