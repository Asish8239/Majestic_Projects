"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Download, Copy, FileJson, FileText, Check } from "lucide-react";
import { getProjects, deleteProject, clearAllProjects } from "@/lib/storage";
import { ProjectData } from "@/lib/types";
import {
  exportAsJSON,
  exportAsPDF,
  copyToClipboard,
  formatProjectAsText,
} from "@/lib/formatter";

export default function HistoryPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    setProjects(getProjects());
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
      loadProjects();
    }
  };

  const handleClearAll = () => {
    if (
      confirm(
        "Are you sure you want to delete ALL projects? This cannot be undone."
      )
    ) {
      clearAllProjects();
      loadProjects();
    }
  };

  const handleCopy = async (project: ProjectData) => {
    await copyToClipboard(formatProjectAsText(project));
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              Project History
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {projects.length} project{projects.length !== 1 ? "s" : ""} saved
            </p>
          </div>

          {projects.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass dark:glass-dark p-12 rounded-2xl shadow-xl text-center"
        >
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No Projects Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Generate your first project to see it here
          </p>
          <a
            href="/generator"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Go to Generator
          </a>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass dark:glass-dark p-6 rounded-2xl shadow-xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {project.title}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {project.domain}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(project.timestamp)}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  aria-label="Delete project"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Problem Statement */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Problem Statement
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {project.problem_statement}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(project)}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all"
                >
                  {copiedId === project.id ? (
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
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>PDF</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => exportAsJSON(project)}
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all"
                >
                  <FileJson className="w-4 h-4" />
                  <span>JSON</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
