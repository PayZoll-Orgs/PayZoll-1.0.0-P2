import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Stars } from "lucide-react";

const testimonials = [
  {
    quote:
      "PayZoll has made payroll seamless and secure for our global team. It's the future of workforce management!",
    author: "Sarah Chen",
    position: "CEO, TechForward",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5
  },
  {
    quote:
      "The integration of blockchain technology has eliminated all our cross-border payment hassles. Simply revolutionary!",
    author: "Michael Rodriguez",
    position: "HR Director, GlobalTech Solutions",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5
  },
  {
    quote:
      "Zero-knowledge proofs ensure our payroll data stays confidential while maintaining transparency. Exactly what we needed!",
    author: "Emma Thompson",
    position: "CFO, Innovation Labs",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    rating: 5
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'gradientMove 20s linear infinite'
          }}
        />

        {/* Floating quote marks */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`
            }}
          >
            <Quote className={`w-${Math.random() * 8 + 4} h-${Math.random() * 8 + 4} text-indigo-500`} />
          </div>
        ))}
      </div>

      {/* Gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 mb-6 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Stars className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-400 font-medium">Client Success Stories</span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Trusted by{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Forward-Thinking
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-50" />
            </span>
            {' '}Businesses
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join the companies revolutionizing their payroll management with blockchain technology
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-3 text-gray-400 hover:text-indigo-400 transition-colors bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-700 hover:border-indigo-500 group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          {/* Testimonials slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-8"
                >
                  <div className="group bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 hover:bg-gradient-to-r hover:from-indigo-900/20 hover:to-purple-900/20 transition-all duration-300 border border-gray-800/50 hover:border-indigo-500/30 backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-8">
                        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
                        <img
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="relative w-24 h-24 rounded-full object-cover ring-4 ring-gray-800 group-hover:ring-indigo-500/30 transition-all duration-300"
                        />
                      </div>

                      <div className="flex items-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Stars key={i} className="w-5 h-5 text-indigo-400" />
                        ))}
                      </div>

                      <blockquote className="relative text-xl text-gray-300 text-center mb-8 italic">
                        <Quote className="absolute -top-4 -left-4 w-8 h-8 text-indigo-500/20" />
                        {testimonial.quote}
                        <Quote className="absolute -bottom-4 -right-4 w-8 h-8 text-indigo-500/20 transform rotate-180" />
                      </blockquote>

                      <cite className="not-italic text-center">
                        <p className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                          {testimonial.author}
                        </p>
                        <p className="text-indigo-400 font-medium">
                          {testimonial.position}
                        </p>
                      </cite>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-3 text-gray-400 hover:text-indigo-400 transition-colors bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-700 hover:border-indigo-500 group"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          {/* Pagination dots */}
          <div className="flex justify-center mt-12 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`group relative p-2 transition-transform hover:scale-110 ${currentIndex === index ? "scale-110" : ""
                  }`}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
              >
                <div className={`absolute inset-0 rounded-full blur transition-opacity ${currentIndex === index
                    ? "bg-indigo-400 opacity-50"
                    : "opacity-0 group-hover:opacity-25"
                  }`} />
                <div className={`relative w-3 h-3 rounded-full transition-colors duration-300 ${currentIndex === index
                    ? "bg-gradient-to-r from-indigo-400 to-purple-400"
                    : "bg-gray-700 group-hover:bg-gray-600"
                  }`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes gradientMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;