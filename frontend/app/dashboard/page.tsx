"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  FolderOpen,
  TrendingUp,
  Plus,
  Star,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { DatabaseService } from "@/lib/db-service";
import { DBProject } from "@/lib/database.types";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProjects: 0,
    favoriteCount: 0,
    uniqueDomains: 0,
    recentProjects: [] as DBProject[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      loadDashboardData();
    }
  }, [session]);

  const loadDashboardData = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const data = await DatabaseService.getUserStats(session.user.id);
      setStats(data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (projectId: string, currentFavorite: boolean) => {
    if (!session?.user?.id) return;

    const { error } = await DatabaseService.toggleFavorite(
      projectId,
      session.user.id,
      !currentFavorite
    );

    if (!error) {
      loadDashboardData();
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!session?.user?.id) return;
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await DatabaseService.deleteProject(projectId, session.user.id);

    if (!error) {
      loadDashboardData();
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
          Welcome back, {session.user.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Here's what's happening with your projects
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass dark:glass-dark p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {stats.totalProjects}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Total Projects</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass dark:glass-dark p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {stats.favoriteCount}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Favorites</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass dark:glass-dark p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
            {stats.uniqueDomains}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Unique Domains</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <Link href="/generator">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Generate New Project</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Recent Projects
          </h2>
          <Link
            href="/history"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {stats.recentProjects.length === 0 ? (
          <div className="glass dark:glass-dark p-12 rounded-2xl text-center">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by generating your first project
            </p>
            <Link href="/generator">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.recentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="glass dark:glass-dark p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {project.title}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                        {project.domain}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {project.project_json.problem_statement.substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.project_json.tech_stack.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.project_json.tech_stack.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                          +{project.project_json.tech_stack.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleFavorite(project.id, project.favorite)}
                      className={`p-2 rounded-lg transition-all ${
                        project.favorite
                          ? "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30"
                          : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                      }`}
                    >
                      <Star className="w-5 h-5" fill={project.favorite ? "currentColor" : "none"} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </span>
                  {project.difficulty && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {project.difficulty}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
