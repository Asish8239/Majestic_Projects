"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import GeneratorForm from "@/components/GeneratorForm";
import OutputCard from "@/components/OutputCard";
import { generateProject, regenerateProject } from "@/lib/api";
import { useProjects } from "@/hooks/useProjects";
import { ProjectJSON } from "@/types/project";
import { AlertCircle, RefreshCw, Check } from "lucide-react";
import { addToGenerationMemory } from "@/lib/generation-memory";
import { toast } from "sonner";

export default function GeneratorPage() {
  const { data: session } = useSession();
  const { saveProject: saveToStorage } = useProjects();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectJSON | null>(null);
  const [lastRequest, setLastRequest] = useState<any>(null);

  const handleGenerate = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    setProject(null);
    setIsSaved(false);

    try {
      const response = await generateProject(formData);
      
      const newProject: ProjectJSON = {
        title: response.title,
        domain: response.domain,
        problem_statement: response.problem_statement,
        solution: response.solution,
        tech_stack: response.tech_stack,
        abstract: response.abstract,
      };
      
      setProject(newProject);
      setLastRequest(formData);

      // Add to generation memory to prevent repetition
      addToGenerationMemory(newProject.title);

      // Auto-save for all users (authenticated → Supabase, guest → localStorage)
      const metadata = {
        difficulty: formData.difficulty,
        purpose: formData.purpose,
        outputType: formData.output_type,
      };
      
      const saved = await saveToStorage(newProject, metadata);
      if (saved) {
        setIsSaved(true);
        toast.success("Project generated and saved successfully!");
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        toast.error("Project generated but failed to save");
      }
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
    setIsSaved(false);

    try {
      const response = await regenerateProject(lastRequest, instruction);
      
      const newProject: ProjectJSON = {
        title: response.title,
        domain: response.domain,
        problem_statement: response.problem_statement,
        solution: response.solution,
        tech_stack: response.tech_stack,
        abstract: response.abstract,
      };
      
      setProject(newProject);

      // Auto-save regenerated project
      const metadata = {
        difficulty: lastRequest.difficulty,
        purpose: lastRequest.purpose,
        outputType: lastRequest.output_type,
      };
      
      const saved = await saveToStorage(newProject, metadata);
      if (saved) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      }
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
                className="space-y-4"
              >
                {/* Auto-Save Feedback */}
                {isSaved && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl"
                  >
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-green-800 dark:text-green-200 font-medium">
                      Project saved successfully!
                    </span>
                  </motion.div>
                )}

                {/* Output Card */}
                <OutputCard
                  project={{
                    ...project,
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                  }}
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
