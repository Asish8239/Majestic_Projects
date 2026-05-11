"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Zap, Shield, Rocket } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI-Powered Generation",
      description: "Advanced AI creates realistic, implementable project ideas tailored to your domain",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Abstracts",
      description: "Generate structured academic abstracts in seconds, ready for submission",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "100% Free Stack",
      description: "No database, no paid APIs. Everything runs on free tier services",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Multi-Domain Support",
      description: "AI, Web Dev, IoT, Data Science, Cybersecurity, Blockchain & more",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <span className="text-6xl md:text-8xl">🎯</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
            Generate Industry-Ready Projects Instantly
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Transform your ideas into structured academic abstracts and complete project proposals with AI-powered precision
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generator">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Generating
              </motion.button>
            </Link>
            
            <Link href="/history">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass dark:glass-dark text-gray-800 dark:text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                View History
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="glass dark:glass-dark p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass dark:glass-dark rounded-3xl p-12 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                6+
              </div>
              <div className="text-gray-600 dark:text-gray-300">Domains Supported</div>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                3
              </div>
              <div className="text-gray-600 dark:text-gray-300">Difficulty Levels</div>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-gray-600 dark:text-gray-300">Free Forever</div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
