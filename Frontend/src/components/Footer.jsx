import React, { useState } from "react";
import { Wallet2, Twitter, Linkedin, Github, Mail, ArrowRight, Globe, Shield, Layers, ChevronUp, Instagram, Send } from "lucide-react";

export default function Footer() {
  const [hoverState, setHoverState] = useState({
    newsletter: false,
    scrollTop: false
  });

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail("");
    alert("Thank you for subscribing!");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer id="footer" className="relative bg-gradient-to-b from-gray-900 to-black text-gray-300 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-5"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(99,102,241,0) 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse-${i} ${Math.random() * 10 + 15}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-purple-900/20 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-12">
                <h3 className="text-2xl font-bold text-white mb-2">Stay updated</h3>
                <p className="text-gray-300">
                  Get the latest news and updates from PayZoll
                </p>
              </div>
              <form onSubmit={handleSubmit} className="w-full md:w-auto">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full md:w-64 px-4 py-3 rounded-l-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    onMouseEnter={() => setHoverState({ ...hoverState, newsletter: true })}
                    onMouseLeave={() => setHoverState({ ...hoverState, newsletter: false })}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-3 rounded-r-lg flex items-center transition-all duration-300"
                  >
                    <span className="text-white font-medium">Subscribe</span>
                    <ArrowRight
                      className={`ml-2 h-5 w-5 text-white transition-transform duration-300 ${hoverState.newsletter ? 'translate-x-1' : ''}`}
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 bg-indigo-600 rounded-lg opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wallet2 className="h-8 w-8 text-indigo-500" />
                </div>
              </div>
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                PayZoll
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Next-generation crypto payroll platform for the modern workforce. Secure, efficient, and transparent.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: "https://x.com/i/flow/login?redirect_after_login=%2FPayZoll", label: "Twitter" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/payzoll/", label: "LinkedIn" },
                { icon: Instagram, href: "https://www.instagram.com/_payzoll_/?igsh=c3UyODlqMXg2dnJr", label: "Instagram" },
                { icon: Send, href: "https://t.me/+HgwcGg7vPVc5MWI1", label: "Telegram" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                >
                  <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Product",
              links: [
                { name: "Features", href: "#features" },
                { name: "Pricing", href: "#pricing" },
                { name: "Security", href: "#security" },
                { name: "Enterprise", href: "#enterprise" },
                { name: "API", href: "#api" }
              ]
            },
            {
              title: "Company",
              links: [
                { name: "About", href: "#about" },
                { name: "Blog", href: "#blog" },
                { name: "Careers", href: "#careers" },
                { name: "Contact", href: "#contact" },
                { name: "Partners", href: "#partners" }
              ]
            },
            {
              title: "Legal",
              links: [
                { name: "Privacy", href: "#privacy" },
                { name: "Terms", href: "#terms" },
                { name: "Cookie Policy", href: "#cookies" },
                { name: "Licenses", href: "#licenses" },
                { name: "Compliance", href: "#compliance" }
              ]
            }
          ].map((column, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-6 text-lg">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 flex items-center group"
                    >
                      <span className="relative overflow-hidden inline-block">
                        <span className="relative inline-block transition-transform duration-300 group-hover:translate-x-1">
                          {link.name}
                        </span>
                      </span>
                      <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact emails section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <h3 className="text-white font-semibold mb-6 text-lg">Contact Us</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { email: "founder@payzoll.in", title: "Founder" },
              { email: "tech@payzoll.in", title: "Technical Support" },
              { email: "marketing@payzoll.in", title: "Marketing" },
              { email: "hr@payzoll.in", title: "Human Resources" }
            ].map((contact, index) => (
              <div key={index} className="group">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <div>
                    <p className="font-medium">{contact.title}</p>
                    <p className="text-sm text-gray-500 group-hover:text-gray-300">{contact.email}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 flex items-center text-sm">
              <Shield className="h-4 w-4 mr-2" />
              <span>Your data is protected with enterprise-grade encryption</span>
            </p>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-400">
              <Globe className="h-4 w-4 mr-1" />
              <span>English</span>
            </div>
            <div className="h-4 w-px bg-gray-700"></div>
            <div className="flex items-center text-gray-400">
              <Layers className="h-4 w-4 mr-1" />
              <span>All chains supported</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} PayZoll. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#terms" className="hover:text-white transition-colors">Terms</a>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="#cookies" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        onMouseEnter={() => setHoverState({ ...hoverState, scrollTop: true })}
        onMouseLeave={() => setHoverState({ ...hoverState, scrollTop: false })}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-500 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
        aria-label="Back to top"
      >
        <ChevronUp
          className={`h-6 w-6 text-white transition-transform duration-300 ${hoverState.scrollTop ? '-translate-y-1' : ''}`}
        />
      </button>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes pulse-0 {
          0% { transform: scale(1); opacity: 0.05; }
          100% { transform: scale(1.1); opacity: 0.1; }
        }
        @keyframes pulse-1 {
          0% { transform: scale(1.1); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.05; }
        }
        @keyframes pulse-2 {
          0% { transform: scale(1); opacity: 0.05; }
          100% { transform: scale(1.2); opacity: 0.1; }
        }
        @keyframes pulse-3 {
          0% { transform: scale(1.2); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.05; }
        }
        @keyframes pulse-4 {
          0% { transform: scale(1); opacity: 0.05; }
          100% { transform: scale(1.3); opacity: 0.1; }
        }
        @keyframes pulse-5 {
          0% { transform: scale(1.3); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.05; }
        }
        @keyframes pulse-6 {
          0% { transform: scale(1); opacity: 0.05; }
          100% { transform: scale(1.1); opacity: 0.1; }
        }
        @keyframes pulse-7 {
          0% { transform: scale(1.1); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.05; }
        }
      `}</style>
    </footer>
  );
}
