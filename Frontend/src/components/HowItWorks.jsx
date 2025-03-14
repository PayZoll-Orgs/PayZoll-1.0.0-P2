import React, { useState, useEffect } from 'react';
import {
  Building2,
  BadgeCheck,
  Banknote,
  ArrowRightLeft,
  TimerReset,
  SendToBack,
  Wallet,
  UserCheck,
  Sparkles
} from 'lucide-react';

const StepsAnimation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const steps = [
    {
      icon: Building2,
      secondaryIcon: BadgeCheck,
      title: "Enterprise Verification",
      description: "Complete streamlined KYC/AML verification for your company and team members across jurisdictions with our advanced validation protocol.",
      highlight: "from-emerald-500 to-teal-600",
      bgHighlight: "from-emerald-500/5 to-teal-600/5"
    },
    {
      icon: Banknote,
      secondaryIcon: Wallet,
      title: "Multi-Chain Funding",
      description: "Deposit funds using any blockchain token or network. Our protocol automatically detects and secures your assets in your enterprise vault.",
      highlight: "from-blue-500 to-indigo-600",
      bgHighlight: "from-blue-500/5 to-indigo-600/5"
    },
    {
      icon: ArrowRightLeft,
      secondaryIcon: TimerReset,
      title: "Automated Conversion & Scheduling",
      description: "Our smart contracts handle token swaps, cross-chain bridges, and establish recurring payment streams with programmable distribution logic.",
      highlight: "from-violet-500 to-purple-600",
      bgHighlight: "from-violet-500/5 to-purple-600/5"
    },
    {
      icon: SendToBack,
      secondaryIcon: UserCheck,
      title: "Seamless Distribution & Off-ramping",
      description: "Recipients receive funds instantly with customizable off-ramp options—direct to bank accounts, crypto wallets, or mobile payment systems.",
      highlight: "from-pink-500 to-rose-600",
      bgHighlight: "from-pink-500/5 to-rose-600/5"
    },
  ];

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [steps.length, isHovered]);

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
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

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
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
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center space-x-2 mb-6 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-400 font-medium">How It Works</span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Simple{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Four-Step
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-50" />
            </span>
            {' '}Process
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience seamless payroll management with our enterprise-grade blockchain solution
          </p>
        </div>

        {/* Steps Progress Bar */}
        <div className="flex justify-between mb-20 relative max-w-4xl mx-auto">
          <div className="absolute h-1 bg-gray-800 left-0 right-0 top-4 -z-10"></div>
          <div
            className="absolute h-1 bg-gradient-to-r from-indigo-500 to-purple-500 left-0 top-4 -z-10 transition-all duration-500"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          ></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="z-10 flex flex-col items-center relative cursor-pointer group"
              onMouseEnter={() => {
                setIsHovered(true);
                setActiveStep(index);
              }}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500
                  ${activeStep >= index
                    ? `bg-gradient-to-r ${step.highlight} shadow-lg scale-125`
                    : 'bg-gray-800'}`}
              >
                {activeStep > index ? (
                  <BadgeCheck className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                )}
              </div>
              <span
                className={`absolute -bottom-6 text-sm font-medium transition-all duration-300 whitespace-nowrap
                  ${activeStep === index ? 'text-white scale-110' : 'text-gray-500'}`}
              >
                {step.title.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Visual Side */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50">
              <div className="relative h-[400px]">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const SecondaryIcon = step.secondaryIcon;

                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-700
                        ${activeStep === index
                          ? 'opacity-100 transform scale-100 rotate-0'
                          : 'opacity-0 transform scale-90 rotate-12'}`}
                    >
                      {/* Main icon container */}
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${step.bgHighlight} rounded-3xl blur-xl`} />
                        <div className={`relative p-8 rounded-2xl bg-gradient-to-r ${step.highlight} shadow-lg`}>
                          <StepIcon size={80} className="text-white" />
                        </div>

                        {/* Secondary floating icon */}
                        <div
                          className={`absolute -right-4 -bottom-4 p-4 rounded-xl bg-gray-800 border-2 border-gray-700
                            ${activeStep === index ? 'animate-bounce' : ''}`}
                        >
                          <SecondaryIcon size={24} className="text-white" />
                        </div>

                        {/* Animated rings */}
                        <div className="absolute inset-0 -z-10">
                          <div className="absolute inset-0 animate-ping opacity-20">
                            <div className={`w-full h-full rounded-full bg-gradient-to-r ${step.highlight}`} />
                          </div>
                          <div className="absolute inset-0 animate-pulse opacity-10">
                            <div className={`w-full h-full rounded-full bg-gradient-to-r ${step.highlight}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-700 absolute w-full
                  ${activeStep === index
                    ? 'opacity-100 transform translate-x-0'
                    : 'opacity-0 transform translate-x-8 pointer-events-none'}`}
                style={{
                  position: activeStep === index ? 'relative' : 'absolute'
                }}
              >
                <div className="mb-4">
                  <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r ${step.bgHighlight} border border-gray-700`}>
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed text-lg mb-8">{step.description}</p>

                {/* Progress indicator */}
                <div className="flex space-x-2">
                  {steps.map((_, dotIndex) => (
                    <div
                      key={dotIndex}
                      className={`h-1 rounded-full transition-all duration-300 ${dotIndex === activeStep
                          ? `w-8 bg-gradient-to-r ${steps[dotIndex].highlight}`
                          : 'w-2 bg-gray-700'
                        }`}
                    />
                  ))}
                </div>
              </div>
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

export default StepsAnimation;