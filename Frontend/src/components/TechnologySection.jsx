import React from 'react';
import {
  Database,
  HardDrive,
  Lock,
  Users,
  Globe,
  ArrowRightLeft,
  Cpu,
  Sparkles
} from 'lucide-react';

const technologies = [
  {
    icon: Database,
    title: "Distributed Data Sharding",
    description: "Our proprietary sharding protocol fragments sensitive payroll data across multiple secure nodes, eliminating single points of failure while maintaining sub-second query performance for enterprise-scale operations."
  },
  {
    icon: HardDrive,
    title: "Decentralized Storage Architecture",
    description: "Employee and payment information is distributed across a network of encrypted IPFS nodes, ensuring data permanence and protection from censorship or centralized server vulnerabilities."
  },
  {
    icon: Lock,
    title: "Three-Tier Encryption Framework",
    description: "Enterprise-grade security with layered encryption: application-level, transport-level, and storage-level protection ensures data remains secure at rest, in transit, and during processing."
  },
  {
    icon: Users,
    title: "Multi-Signature Authentication",
    description: "Critical transactions require cryptographic approval from multiple authorized parties, preventing unauthorized access and providing corporate governance-compliant approval workflows."
  },
  {
    icon: Globe,
    title: "Web3 Ecosystem Integration",
    description: "Seamless connections to leading DeFi protocols, DEXs, and cross-chain bridges enable flexible token funding across multiple blockchains while optimizing for lowest transaction fees."
  },
  {
    icon: ArrowRightLeft,
    title: "Comprehensive Off-Ramp Solutions",
    description: "Integrated conversion pathways to traditional banking systems, payment processors, and digital wallets allow recipients to receive funds in their preferred currency without technical complexity."
  }
];

const TechnologySection = () => {
  return (
    <section id="tech" className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Animated background grid */}
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

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: `rgba(99, 102, 241, ${Math.random() * 0.3 + 0.1})`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 mb-6 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-400 font-medium">Enterprise Technology</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Advanced Blockchain Innovation Meets{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Payroll Excellence
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-50"></span>
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Leveraging cutting-edge technology for seamless, secure, and scalable payroll management
          </p>
        </div>

        {/* Interactive Visualization - Now at the top */}
        <div className="relative h-[400px] mb-20">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Central Hub */}
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl">
                <Cpu className="w-16 h-16 text-white" />
              </div>

              {/* Orbiting Elements */}
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="absolute w-20 h-20"
                  style={{
                    animation: `orbit ${20 + index * 2}s linear infinite${index % 2 ? ' reverse' : ''}`,
                    transformOrigin: '50% 50%',
                  }}
                >
                  <div className="absolute -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-indigo-500/20 backdrop-blur-sm flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:border-indigo-500/50 group">
                      {React.createElement(tech.icon, {
                        className: "w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition-colors"
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technology Cards - 2x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="group bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-6 hover:bg-gradient-to-r hover:from-indigo-900/20 hover:to-purple-900/20 transition-all duration-300 border border-gray-800/50 hover:border-indigo-500/30 h-full flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 mb-4">
                {React.createElement(tech.icon, {
                  className: "h-6 w-6 text-white group-hover:animate-pulse"
                })}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {tech.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mt-auto">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes gradientMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
      `}</style>
    </section>
  );
};

export default TechnologySection;
