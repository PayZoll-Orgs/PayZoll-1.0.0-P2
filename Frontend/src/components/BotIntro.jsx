import React, { useEffect, useState } from 'react';
import { Bot, Sparkles, Binary } from 'lucide-react';

function BotIntro() {
    const [showContent, setShowContent] = useState(false);
    const [redirect, setRedirect] = useState(false);

   

    useEffect(() => {
        // Show content with delay
        setTimeout(() => setShowContent(true), 500);

        // Redirect after 8 seconds
        setTimeout(() => setRedirect(true), 8000);
    }, []);

    useEffect(() => {
        if (redirect) {
            // Replace this URL with your actual bot site URL
            window.location.href = 'https://web-agent-client.onrender.com';
        }
    }, [redirect]);

    return (
        <div id="bot" className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
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

                {/* Floating binary elements */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute opacity-10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 10 + 10}s linear infinite`
                        }}
                    >
                        <Binary className={`w-${Math.random() * 8 + 4} h-${Math.random() * 8 + 4} text-indigo-500`} />
                    </div>
                ))}
            </div>

            {/* Gradient orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className={`relative z-10 min-h-screen flex items-center justify-center transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-center px-4">
                    <div className="inline-flex items-center justify-center space-x-2 mb-8 px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        <span className="text-indigo-400 font-medium">AI Assistant</span>
                    </div>

                    <div className="mb-12 relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20 blur-lg animate-pulse" />
                        <Bot className="w-24 h-24 mx-auto text-indigo-400 relative animate-bounce" />
                    </div>

                    <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                        Meet the new {' '}
                        <span className="relative">
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                PayZoll Agent
                            </span>
                            <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-50" />
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                        Powered by advanced artificial intelligence, ready to assist you with any payroll tasks, anytime.
                    </p>

                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur animate-pulse" />
                        <div className="relative px-8 py-4 bg-indigo-500/20 rounded-lg backdrop-blur-sm border border-indigo-500/30">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-indigo-400 rounded-full animate-ping" />
                                <span className="text-white font-medium">Initializing AI Systems...</span>
                            </div>
                        </div>
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
        </div>
    );
}

export default BotIntro;