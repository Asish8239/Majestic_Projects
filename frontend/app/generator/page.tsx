"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GeneratorForm from "@/components/GeneratorForm";
import OutputCard from "@/components/OutputCard";
import { generateProject, regenerateProject } from "@/lib/api";
import { saveProject } from "@/lib/storage";
import { ProjectData } from "@/lib/types";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [lastRequest, setLastRequest] = useState<any>(null);

  const handleGenerate = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    setProject(null);

    try {
      const response = await generateProject(formData);
      
      const newProject: Omit<ProjectData, "id" | "timestamp"> = {
        title: response.title,
        domain: response.domain,
        problem_statement: response.problem_statement,
        solution: response.solution,
        tech_stack: response.tech_stack,
        abstract: response.abstract,
      };

      saveProject(newProject);
      
      // Add id and timestamp for display
      const displayProject: ProjectData = {
        ...newProject,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      
      setProject(displayProject);
      setLastRequest(formData);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to generate project. Please try again.";
      setError(errorMessage);
      console.error("Generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (instruction: string) => {
    if (!lastRequest) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const response = await regenerateProject(lastRequest, instruction);
      
      const newProject: Omit<ProjectData, "id" | "timestamp"> = {
        title: response.title,
        domain: response.domain,
        problem_statement: response.problem_statement,
        solution: response.solution,
        tech_stack: response.tech_stack,
        abstract: response.abstract,
      };

      saveProject(newProject);
      
      const displayProject: ProjectData = {
        ...newProject,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      
      setProject(displayProject);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to regenerate project. Please try again.";
      setError(errorMessage);
      console.error("Regeneration error:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRetry = () => {
    if (lastRequest) {
      handleGenerate(lastRequest);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-4">
          Project Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Configure your project parameters and let AI create something amazing
        </p>
      </motion.div>

      {/* Error Message with Retry */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 dark:text-red-200 font-medium">Generation Failed</p>
                  <p className="text-red-700 dark:text-red-300 text-sm mb-3">{error}</p>
                  <p className="text-red-600 dark:text-red-400 text-xs">
                    Don't worry! The system has multiple AI providers and fallbacks to ensure it works.
                  </p>
                </div>
              </div>
              {lastRequest && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Retry</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div>
          <GeneratorForm onSubmit={handleGenerate} isLoading={isLoading} />
        </div>

        {/* Right: Output */}
        <div>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass dark:glass-dark p-8 rounded-2xl shadow-xl"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block text-4xl mb-4"
                  >
                    🎯
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Generating Your Project...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    AI is crafting something amazing for you
                  </p>
                  
                  {/* Loading Skeleton */}
                  <div className="space-y-4 text-left">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                    <div className="grid grid-cols-3 gap-2 mt-6">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : project ? (
              <motion.div
                key="project"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <OutputCard
                  project={project}
                  onRegenerate={handleRegenerate}
                  isRegenerating={isRegenerating}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass dark:glass-dark p-12 rounded-2xl shadow-xl text-center h-full flex flex-col items-center justify-center"
              >
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Ready to Generate
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Fill out the form and click "Generate Project" to get started
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
