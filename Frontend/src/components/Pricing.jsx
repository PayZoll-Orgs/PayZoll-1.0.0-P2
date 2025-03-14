import React from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    duration: 'for 1 month',
    features: [
      'Up to 10 employees',
      'Basic payroll features',
      'Email support',
      'Basic analytics'
    ]
  },
  {
    name: 'Standard',
    price: '$5',
    duration: 'per month / employee',
    popular: true,
    features: [
      'Up to 50 employees',
      'Advanced payroll features',
      'Priority support',
      'Advanced analytics',
      'Custom payment schedules',
      'Multi-currency support'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    duration: 'tailored for you',
    features: [
      'Unlimited employees',
      'Full feature access',
      'Dedicated support',
      'Custom integration',
      'Advanced security',
      'SLA guarantee'
    ]
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-crypto-dark relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400">
            Choose the perfect plan for your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 ${plan.popular
                  ? 'bg-gradient-to-b from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/20 transform scale-105'
                  : 'bg-crypto-card border border-gray-800'
                }`}
            >
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-white'}`}>
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold mb-2">
                  {plan.price}
                </div>
                <div className={plan.popular ? 'text-indigo-100' : 'text-gray-400'}>
                  {plan.duration}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className={`h-5 w-5 mr-2 ${plan.popular ? 'text-indigo-200' : 'text-indigo-400'}`} />
                    <span className={plan.popular ? 'text-white' : 'text-gray-400'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-full text-center transition-all ${plan.popular
                    ? 'bg-white text-indigo-600 hover:shadow-lg'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/20'
                  }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}