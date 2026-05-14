"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, X, Search, Sparkles } from "lucide-react";

interface GeneratorFormProps {
  onSubmit: (data: {
    domain: string;
    difficulty: string;
    purpose: string;
    output_type: string;
  }) => void;
  isLoading: boolean;
}

// Expanded domain categories with 50+ domains
const domainCategories = {
  "AI + Machine Learning": [
    "Machine Learning",
    "Deep Learning",
    "Generative AI",
    "NLP",
    "Computer Vision",
    "Recommendation Systems",
    "Predictive Analytics",
    "AI Automation",
  ],
  "Data + Analytics": [
    "Data Analytics",
    "Big Data",
    "Business Intelligence",
    "Data Visualization",
    "Real-Time Analytics",
    "Streaming Systems",
  ],
  "Software + Full Stack": [
    "Full Stack Development",
    "Cloud Computing",
    "DevOps",
    "API Engineering",
    "SaaS Platforms",
    "Microservices",
  ],
  "Image + Video Systems": [
    "Image Processing",
    "Video Analytics",
    "OCR Systems",
    "Medical Imaging",
    "Facial Recognition",
    "Object Detection",
  ],
  "Real-Time + IoT": [
    "Real-Time Systems",
    "IoT Automation",
    "Edge Computing",
    "Event-Driven Systems",
    "Smart Monitoring",
  ],
  "Security + Blockchain": [
    "Cybersecurity",
    "Blockchain",
    "Fraud Detection",
    "Threat Intelligence",
    "Zero Trust Systems",
  ],
  "Emerging Technologies": [
    "AR/VR",
    "Robotics",
    "Quantum Computing",
    "Digital Twin",
    "Autonomous Systems",
  ],
  "Industry Domains": [
    "Healthcare",
    "Finance",
    "Agriculture",
    "Education",
    "Smart Cities",
    "Retail",
    "Manufacturing",
    "Transportation",
    "Climate Tech",
  ],
};

// Trending domain combinations for inspiration
const trendingCombinations = [
  ["Machine Learning", "Healthcare", "Computer Vision"],
  ["IoT Automation", "Agriculture", "Real-Time Analytics"],
  ["Full Stack Development", "Machine Learning", "SaaS Platforms"],
  ["Blockchain", "Cybersecurity", "Finance"],
  ["Deep Learning", "Medical Imaging", "Edge Computing"],
  ["NLP", "Education", "AI Automation"],
  ["Computer Vision", "Retail", "Object Detection"],
  ["Big Data", "Climate Tech", "Predictive Analytics"],
];

export default function GeneratorForm({ onSubmit, isLoading }: GeneratorFormProps) {
  const [selectedDomains, setSelectedDomains] = useState<string[]>(["Machine Learning"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    difficulty: "Intermediate",
    purpose: "Academic",
    output_type: "Full Project",
  });

  // Flatten all domains for search
  const allDomains = Object.values(domainCategories).flat();

  const difficulties = ["Beginner", "Intermediate", "Advanced"];
  const purposes = ["Academic", "Portfolio", "Startup"];
  const outputTypes = ["Idea Only", "Abstract", "Full Project"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      domain: selectedDomains.join(" + "),
      ...formData,
    });
  };

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      if (selectedDomains.length > 1) {
        setSelectedDomains(selectedDomains.filter((d) => d !== domain));
      }
    } else {
      // NO LIMIT - users can select unlimited domains
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const applyTrendingCombination = (combination: string[]) => {
    setSelectedDomains(combination);
    setSearchQuery("");
  };

  // Filter domains based on search query
  const getFilteredCategories = () => {
    if (!searchQuery.trim()) return domainCategories;

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, string[]> = {};

    Object.entries(domainCategories).forEach(([category, domains]) => {
      const matchingDomains = domains.filter((domain) =>
        domain.toLowerCase().includes(query)
      );
      if (matchingDomains.length > 0) {
        filtered[category] = matchingDomains;
      }
    });

    return filtered;
  };

  const filteredCategories = getFilteredCategories();

  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="glass dark:glass-dark p-6 rounded-2xl shadow-xl space-y-6"
    >
      <h2 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
        Project Configuration
      </h2>

      {/* Domain - Multi-Select with Search */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Domains (Select Unlimited)
        </label>

        {/* Selected Domain Tags */}
        <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
          {selectedDomains.map((domain) => (
            <motion.div
              key={domain}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium shadow-md"
            >
              <span>{domain}</span>
              {selectedDomains.length > 1 && (
                <button
                  type="button"
                  onClick={() => toggleDomain(domain)}
                  className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Trending Combinations */}
        {!searchQuery && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Trending Combinations
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingCombinations.slice(0, 4).map((combo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyTrendingCombination(combo)}
                  className="px-2 py-1 text-xs bg-white dark:bg-black/40 text-gray-700 dark:text-gray-300 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  {combo.join(" + ")}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Domain Categories */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {Object.entries(filteredCategories).map(([category, domains]) => (
            <div key={category}>
              <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {domains.map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => toggleDomain(domain)}
                    disabled={isLoading}
                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                      selectedDomains.includes(domain)
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-white/50 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-black/50"
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {selectedDomains.length} domain{selectedDomains.length !== 1 ? "s" : ""} selected • No limit
        </p>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Difficulty Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              onClick={() => setFormData({ ...formData, difficulty })}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                formData.difficulty === difficulty
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white/50 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-black/50"
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Purpose
        </label>
        <div className="grid grid-cols-3 gap-2">
          {purposes.map((purpose) => (
            <button
              key={purpose}
              type="button"
              onClick={() => setFormData({ ...formData, purpose })}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                formData.purpose === purpose
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white/50 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-black/50"
              }`}
            >
              {purpose}
            </button>
          ))}
        </div>
      </div>

      {/* Output Type */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Output Type
        </label>
        <select
          value={formData.output_type}
          onChange={(e) =>
            setFormData({ ...formData, output_type: e.target.value })
          }
          className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 dark:text-white"
          disabled={isLoading}
        >
          {outputTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <span>Generate Project</span>
        )}
      </motion.button>
    </motion.form>
  );
}
