/**
 * React Hook for Project Operations
 * Provides easy access to project service with React state management
 */

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ProjectRecord, ProjectJSON, ProjectFilters, ProjectStats } from "@/types/project";
import * as ProjectService from "@/services/project-service";

/**
 * Hook for managing projects
 */
export function useProjects(filters?: ProjectFilters) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ProjectService.getProjects(filters, userId);
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
      console.error("Error loading projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, userId]);

  // Load on mount and when filters/userId change
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Save project
  const saveProject = useCallback(
    async (
      projectData: ProjectJSON,
      metadata?: {
        difficulty?: string;
        purpose?: string;
        outputType?: string;
      }
    ): Promise<ProjectRecord | null> => {
      try {
        const saved = await ProjectService.saveProject(projectData, metadata, userId);
        if (saved) {
          setProjects((prev) => [saved, ...prev]);
        }
        return saved;
      } catch (err: any) {
        setError(err.message || "Failed to save project");
        console.error("Error saving project:", err);
        return null;
      }
    },
    [userId]
  );

  // Update project
  const updateProject = useCallback(
    async (
      projectId: string,
      updates: Partial<Pick<ProjectRecord, "title" | "isFavorite" | "projectData">>
    ): Promise<ProjectRecord | null> => {
      try {
        const updated = await ProjectService.updateProject(projectId, updates, userId);
        if (updated) {
          setProjects((prev) =>
            prev.map((p) => (p.id === projectId ? updated : p))
          );
        }
        return updated;
      } catch (err: any) {
        setError(err.message || "Failed to update project");
        console.error("Error updating project:", err);
        return null;
      }
    },
    [userId]
  );

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (projectId: string, isFavorite: boolean): Promise<boolean> => {
      try {
        const updated = await ProjectService.toggleFavorite(projectId, isFavorite, userId);
        if (updated) {
          setProjects((prev) =>
            prev.map((p) => (p.id === projectId ? updated : p))
          );
          return true;
        }
        return false;
      } catch (err: any) {
        setError(err.message || "Failed to toggle favorite");
        console.error("Error toggling favorite:", err);
        return false;
      }
    },
    [userId]
  );

  // Delete project
  const deleteProject = useCallback(
    async (projectId: string): Promise<boolean> => {
      try {
        const success = await ProjectService.deleteProject(projectId, userId);
        if (success) {
          setProjects((prev) => prev.filter((p) => p.id !== projectId));
        }
        return success;
      } catch (err: any) {
        setError(err.message || "Failed to delete project");
        console.error("Error deleting project:", err);
        return false;
      }
    },
    [userId]
  );

  // Refresh projects
  const refresh = useCallback(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    isLoading,
    error,
    saveProject,
    updateProject,
    toggleFavorite,
    deleteProject,
    refresh,
  };
}

/**
 * Hook for getting a single project
 */
export function useProject(projectId: string | null) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setIsLoading(false);
      return;
    }

    const loadProject = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await ProjectService.getProject(projectId, userId);
        setProject(data);
      } catch (err: any) {
        setError(err.message || "Failed to load project");
        console.error("Error loading project:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, userId]);

  return { project, isLoading, error };
}

/**
 * Hook for project statistics
 */
export function useProjectStats() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [stats, setStats] = useState<ProjectStats>({
    totalProjects: 0,
    favoriteCount: 0,
    uniqueDomains: 0,
    recentProjects: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ProjectService.getProjectStats(userId);
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load stats");
      console.error("Error loading stats:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return { stats, isLoading, error, refresh: loadStats };
}
