import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ChevronRight, Rocket, Target, Zap, Check, X } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { useInView } from 'react-intersection-observer';
import AuthModal from './AuthModal';
import PricingModal from './PricingModal';

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'AI-powered lead generation (10/month)',
      'Basic email templates',
      'Simple analytics',
      'Single user'
    ],
    limits: {
      leadsPerMonth: 10,
      emailsPerDay: 20,
      campaigns: 1,
      teamMembers: 1,
      customTemplates: 2
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'month',
    features: [
      'Unlimited lead generation',
      'Advanced email automation',
      'Custom templates',
      'Full analytics suite',
      'Priority support',
      'Up to 3 team members'
    ],
    limits: {
      leadsPerMonth: 100,
      emailsPerDay: 100,
      campaigns: 10,
      teamMembers: 3,
      customTemplates: 10
    },
    recommended: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Unlimited everything',
      'Custom AI training',
      'Dedicated account manager',
      'API access',
      'Custom integrations'
    ],
    limits: {
      leadsPerMonth: -1, // unlimited
      emailsPerDay: -1,
      campaigns: -1,
      teamMembers: -1,
      customTemplates: -1
    }
  }
];

const LandingPage = () => {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' as const });
  const [pricingModal, setPricingModal] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      icon: <Target className="w-6 h-6 text-blue-400" />,
      title: 'AI-Powered Lead Generation',
      description: 'Find your perfect clients with our intelligent algorithms that analyze millions of data points.'
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      title: 'Smart Email Automation',
      description: 'Personalized outreach campaigns that adapt and improve based on recipient engagement.'
    },
    {
      icon: <Rocket className="w-6 h-6 text-pink-400" />,
      title: 'Advanced Analytics',
      description: 'Track every metric that matters with our comprehensive analytics dashboard.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Designer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      quote: 'LeadForge AI transformed how I find clients. I\'ve tripled my client base in just 2 months!'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Frontend Developer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      quote: 'The AI-powered outreach saved me countless hours. Best investment for my freelance business.'
    },
    {
      name: 'Emily Watson',
      role: 'Agency Owner',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      quote: 'We scaled our agency from 5 to 50 clients using LeadForge. The ROI is incredible.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Navbar */}
      <nav className="fixed w-full bg-gray-900/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-400" />
              <span className="font-bold text-xl">LeadForge AI</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg font-semibold"
              >
                Start Free Trial
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity }}
        className="pt-32 pb-20 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find & Convert Your
              <span className="gradient-text"> Dream Clients</span>
              <br />
              with AI Magic
            </h1>
            <div className="text-xl text-gray-400 mb-8">
              <TypeAnimation
                sequence={[
                  'Generate qualified leads automatically',
                  2000,
                  'Send personalized outreach at scale',
                  2000,
                  'Convert prospects into paying clients',
                  2000
                ]}
                repeat={Infinity}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-lg font-semibold text-lg"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPricingModal(true)}
                className="bg-gray-800 px-8 py-4 rounded-lg font-semibold text-lg border border-gray-700 hover:border-gray-600"
              >
                View Pricing
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className="py-20 px-4 bg-gray-800/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Scale Your Business
            </h2>
            <p className="text-gray-400 text-lg">
              Powerful tools to find, connect, and convert your ideal clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 text-lg">
              Start free, upgrade when you need to
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -10 }}
                className={`rounded-xl p-6 ${
                  plan.recommended
                    ? 'bg-gradient-to-b from-blue-500/10 to-purple-600/10 border-2 border-blue-500'
                    : 'bg-gray-800/50 border border-gray-700'
                }`}
              >
                {plan.recommended && (
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    plan.recommended
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Freelancers & Agencies
            </h2>
            <p className="text-gray-400 text-lg">
              Join thousands of satisfied customers who grew their business with LeadForge
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800/50 rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of successful freelancers and agencies who use LeadForge AI
            to find and convert their dream clients.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-lg font-semibold text-lg"
          >
            Start Your Free Trial
          </motion.button>
        </div>
      </section>

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
      />

      <PricingModal
        isOpen={pricingModal}
        onClose={() => setPricingModal(false)}
        plans={pricingPlans}
      />
    </div>
  );
};

export default LandingPage;