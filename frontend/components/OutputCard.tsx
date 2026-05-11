"use client";

import { motion } from "framer-motion";
import {
  Download,
  Copy,
  RefreshCw,
  Sparkles,
  FileJson,
  FileText,
  Check,
  Eye,
  Code,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { ProjectData } from "@/lib/types";
import {
  formatAbstract,
  formatProjectAsText,
  exportAsJSON,
  exportAsPDF,
  copyToClipboard,
} from "@/lib/formatter";

interface OutputCardProps {
  project: ProjectData;
  onRegenerate: (instruction: string) => void;
  isRegenerating: boolean;
}

export default function OutputCard({
  project,
  onRegenerate,
  isRegenerating,
}: OutputCardProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "abstract" | "tech">("overview");

  const handleCopy = async () => {
    await copyToClipboard(formatProjectAsText(project));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateOptions = [
    { label: "Regenerate", instruction: "regenerate" },
    { label: "Make it more innovative", instruction: "make_innovative" },
    { label: "Simplify project", instruction: "simplify" },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: <Eye className="w-4 h-4" /> },
    { id: "abstract", label: "Abstract", icon: <BookOpen className="w-4 h-4" /> },
    { id: "tech", label: "Tech Stack", icon: <Code className="w-4 h-4" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass dark:glass-dark rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/20 dark:border-black/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {project.title}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {project.domain}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/20 dark:border-black/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all ${
              activeTab === tab.id
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500"
                : "text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-black/10"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Problem Statement */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Problem Statement
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed bg-white/30 dark:bg-black/20 p-4 rounded-lg">
                {project.problem_statement}
              </p>
            </div>

            {/* Solution */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Solution
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed bg-white/30 dark:bg-black/20 p-4 rounded-lg">
                {project.solution}
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === "abstract" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Structured Abstract */}
            <div className="space-y-4">
              <div className="bg-white/30 dark:bg-black/20 p-4 rounded-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Background:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {project.abstract.background}
                </span>
              </div>
              <div className="bg-white/30 dark:bg-black/20 p-4 rounded-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Objective:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {project.abstract.objective}
                </span>
              </div>
              <div className="bg-white/30 dark:bg-black/20 p-4 rounded-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Methodology:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {project.abstract.methodology}
                </span>
              </div>
              <div className="bg-white/30 dark:bg-black/20 p-4 rounded-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Results:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {project.abstract.results}
                </span>
              </div>
              <div className="bg-white/30 dark:bg-black/20 p-4 rounded-lg">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Conclusion:
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {project.abstract.conclusion}
                </span>
              </div>
            </div>

            {/* Formatted Abstract */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Copy-Ready Format
              </h3>
              <div className="p-4 bg-white/50 dark:bg-black/30 rounded-lg text-gray-600 dark:text-gray-400 leading-relaxed border-l-4 border-blue-500">
                {formatAbstract(project.abstract)}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "tech" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Technology Stack
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {project.tech_stack.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="px-4 py-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-center font-medium shadow-sm"
                  >
                    {tech}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-white/20 dark:border-black/20 bg-white/10 dark:bg-black/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportAsPDF(project)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportAsJSON(project)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
          >
            <FileJson className="w-4 h-4" />
            <span>JSON</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRegenerate("regenerate")}
            disabled={isRegenerating}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`} />
            <span>Regen</span>
          </motion.button>
        </div>

        {/* Regenerate Options */}
        <div className="flex flex-wrap gap-2">
          {regenerateOptions.slice(1).map((option) => (
            <motion.button
              key={option.instruction}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRegenerate(option.instruction)}
              disabled={isRegenerating}
              className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{option.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
