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
                      <div className
