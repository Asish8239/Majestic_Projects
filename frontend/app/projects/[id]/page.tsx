"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useProject } from "@/hooks/useProjects";
import * as ProjectService from "@/services/project-service";
import {
  ArrowLeft,
  Star,
  Calendar,
  Layers,
  Code,
  FileText,
  Target,
  Lightbulb,
  CheckCircle,
  TrendingUp,
  Trash2,
  FileJson,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const projectId = params.id as string;

  const { project, isLoading, error } = useProject(projectId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  // Update favorite state when project loads
  useState(() => {
    if (project) {
      setIsFavorite(project.isFavorite);
    }
  });

  const handleToggleFavorite = async () => {
    if (!project) return;
    const newFavorite = !isFavorite;
    const updated = await ProjectService.toggleFavorite(projectId, newFavorite, userId);
    if (updated) {
      setIsFavorite(newFavorite);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const success = await ProjectService.deleteProject(projectId, userId);
    if (success) {
      router.push("/dashboard");
    }
  };

  const handleCopyJSON = async () => {
    if (!project) return;
    const jsonString = JSON.stringify(project.projectData, null, 2);
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    if (!project) return;
    const jsonString = JSON.stringify(project.projectData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <p className="text-gray-600 dark:text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The project you're looking for doesn't exist."}
          </p>
          <Link href="/dashboard">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const { projectData } = project;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
                {project.title}
              </h1>
              {isFavorite && (
                <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
              )}
            </div>
            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {project.domain}
              </span>
              {project.difficulty && (
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                  {project.difficulty}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleFavorite}
              className={`p-3 rounded-lg transition-all ${
                isFavorite
                  ? "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30"
                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
              }`}
              title="Toggle Favorite"
            >
              <Star className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopyJSON}
              className="p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title="Copy JSON"
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleExportJSON}
              className="p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title="Export JSON"
            >
              <FileJson className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              className="p-3 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
              title="Delete Project"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Problem Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass dark:glass-dark p-6 rounded-2xl shadow-lg mb-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Problem Statement
          </h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {projectData.problem_statement}
        </p>
      </motion.div>

      {/* Solution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass dark:glass-dark p-6 rounded-2xl shadow-lg mb-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Proposed Solution
          </h2>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {projectData.solution}
        </p>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass dark:glass-dark p-6 rounded-2xl shadow-lg mb-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Code className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Technology Stack
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {projectData.tech_stack.map((tech, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-medium"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Abstract */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass dark:glass-dark p-6 rounded-2xl shadow-lg"
      >
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Project Abstract
          </h2>
        </div>

        <div className="space-y-6">
          {/* Background */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-blue-500" />
              <span>Background</span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-7">
              {projectData.abstract.background}
            </p>
          </div>

          {/* Objective */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
              <Target className="w-5 h-5 text-red-500" />
              <span>Objective</span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-7">
              {projectData.abstract.objective}
            </p>
          </div>

          {/* Methodology */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
              <Code className="w-5 h-5 text-green-500" />
              <span>Methodology</span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-7">
              {projectData.abstract.methodology}
            </p>
          </div>

          {/* Results */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span>Expected Results</span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-7">
              {projectData.abstract.results}
            </p>
          </div>

          {/* Conclusion */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Conclusion</span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-7">
              {projectData.abstract.conclusion}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex flex-wrap gap-4"
      >
        <Link href="/generator">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
            Generate Similar Project
          </button>
        </Link>
        <Link href="/dashboard">
          <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
            Back to Dashboard
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
