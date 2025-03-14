import React, { useState } from "react";
import { Shield, Zap, Globe, BarChart, Users, Lock } from "lucide-react";

const features = [
  {
    Icon: Zap,
    title: "Multi Chain Payouts",
    description:
      "Streamline global payments across any blockchain network or traditional banking system. Process simultaneous payouts in crypto or fiat currencies, reducing settlement times from days to minutes while minimizing transaction fees.",
    visual:
      "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=1200",
    color: "from-blue-500 to-indigo-600",
  },
  {
    Icon: Shield,
    title: "Privacy by Design",
    description:
      "Our proprietary three-way data sharding architecture distributes sensitive information across separate secure locations, eliminating single points of vulnerability. Zero-knowledge proofs validate transactions without exposing confidential data, ensuring maximum privacy compliance.",
    visual:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    color: "from-purple-500 to-indigo-600",
  },
  {
    Icon: BarChart,
    title: "Automation",
    description:
      "Intelligent support agents provide instant resolutions to common issues with a single click. Our advanced analytics engine continuously monitors transaction patterns to deliver actionable insights, identify optimization opportunities, and forecast future payment trends.",
    visual:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    color: "from-indigo-500 to-violet-600",
  },
  {
    Icon: Users,
    title: "Integrated Off-Ramps",
    description:
      "Eliminate the complexity of cryptocurrency management for your recipients. Our seamless off-ramp solutions allow team members to receive funds in their preferred format—whether direct bank deposit, mobile money, local currency, or digital assets—without technical knowledge.",
    visual:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1200",
    color: "from-fuchsia-500 to-purple-600",
  },
  {
    Icon: Globe,
    title: "Global Coverage",
    description:
      "Transcend geographical barriers with our worldwide payment network. Execute borderless transactions to over 180 countries without currency conversion delays or excessive international fees. Maintain consistent payment schedules regardless of recipient location.",
    visual:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200",
    color: "from-violet-500 to-purple-600",
  },
  {
    Icon: Lock,
    title: "Enterprise Security",
    description:
      "Deploy institutional-grade protection with our multi-layered security infrastructure. Bank-level encryption, distributed data sharding, zero-knowledge authentication protocols, and multi-signature authorization frameworks combine to create an impenetrable defense system for your payroll operations.",
    visual:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200",
    color: "from-indigo-500 to-blue-600",
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section
      id="features"
      className="py-20 bg-crypto-dark relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-crypto-dark via-crypto-dark to-transparent"></div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-indigo-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              PayZoll
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-400">
            Experience the future of payroll management with our cutting-edge
            features
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden">
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out transform"
                style={{ transform: isHovering ? "scale(1.1)" : "scale(1)" }}
              >
                <img
                  src={features[activeFeature].visual}
                  alt={features[activeFeature].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-crypto-dark via-crypto-dark/80 to-transparent"></div>
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="bg-crypto-card/80 backdrop-blur-xl rounded-2xl p-6 transform transition-all duration-500">
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${features[activeFeature].color} flex items-center justify-center`}
                    >
                      {React.createElement(features[activeFeature].Icon, {
                        className: "w-6 h-6 text-white",
                      })}
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {features[activeFeature].title}
                    </h3>
                  </div>
                  <p className="text-gray-300">
                    {features[activeFeature].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`w-full group relative ${activeFeature === index ? "scale-105" : ""
                  } transition-all duration-300`}
                onMouseEnter={() => {
                  setActiveFeature(index);
                  setIsHovering(true);
                }}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 
                  group-hover:opacity-10 rounded-xl transition-opacity duration-300
                  ${activeFeature === index ? "opacity-10" : ""}
                `}
                ></div>

                <div className="relative bg-crypto-card border border-gray-800 p-6 rounded-xl hover:border-indigo-500/50 transition-all">
                  <div className="flex items-center space-x-4">
                    {React.createElement(feature.Icon, {
                      className: `w-6 h-6 ${activeFeature === index
                          ? "text-indigo-400"
                          : "text-gray-400"
                        } group-hover:text-indigo-400 transition-colors`,
                    })}
                    <span
                      className={`text-lg ${activeFeature === index ? "text-white" : "text-gray-400"
                        } group-hover:text-white transition-colors`}
                    >
                      {feature.title}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}