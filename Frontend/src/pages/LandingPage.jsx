import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import TechnologySection from '../components/TechnologySection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-crypto-dark text-white">
      <div className="fixed inset-0 bg-gradient-radial from-indigo-900/20 via-transparent to-transparent"></div>
      <div className="relative">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <TechnologySection />
        <TestimonialsSection />
        <CTASection />
        <Pricing />
        <Footer />
      </div>
    </div>
  );
}