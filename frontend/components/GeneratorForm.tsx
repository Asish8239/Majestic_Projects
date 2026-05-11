"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface GeneratorFormProps {
  onSubmit: (data: {
    domain: string;
    difficulty: string;
    purpose: string;
    output_type: string;
  }) => void;
  isLoading: boolean;
}

export default function GeneratorForm({ onSubmit, isLoading }: GeneratorFormProps) {
  const [formData, setFormData] = useState({
    domain: "AI",
    difficulty: "Intermediate",
    purpose: "Academic",
    output_type: "Full Project",
  });

  const domains = [
    "AI",
    "Web Development",
    "IoT",
    "Data Science",
    "Cybersecurity",
    "Blockchain",
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];
  const purposes = ["Academic", "Portfolio", "Startup"];
  const outputTypes = ["Idea Only", "Abstract", "Full Project"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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

      {/* Domain */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Domain
        </label>
        <select
          value={formData.domain}
          onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/30 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-800 dark:text-white"
          disabled={isLoading}
        >
          {domains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
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
