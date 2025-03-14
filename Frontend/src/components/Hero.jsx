import React from 'react';
import { ArrowRight, Wallet2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div id="home" className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl animate-glow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-sm">Web3 Payroll Solution</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Decentralized
              </span>
              <br />
              <span className="text-white">
                Payroll Protocol
              </span>
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed">
              Experience the future of payroll with blockchain-powered instant global payments, zero-knowledge privacy, and complete automation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth?mode=register">
                <button className="group bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-indigo-500/20 transition-all flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/auth?mode=register">
                <button className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                  Read Docs
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">Multi Chain</span>
                <span className="text-gray-400">cross-chain-compatible</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">Security</span>
                <span className="text-gray-400">3-factor encryption</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">Automation</span>
                <span className="text-gray-400">LLM powered agents</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-conic from-indigo-500/40 via-purple-500/40 to-indigo-500/40 rounded-full filter blur-3xl opacity-30"></div>
            <div className="relative animate-float">
              <Wallet2 className="w-full h-full text-indigo-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}