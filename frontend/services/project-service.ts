/**
 * Unified Project Service
 * Single source of truth for all project operations
 * Automatically routes to localStorage or Supabase based on auth state
 */

import { ProjectRecord, ProjectJSON, ProjectFilters, ProjectStats } from "@/types/project";
import * as localProjects from "./local-projects";
import * as cloudProjects from "./cloud-projects";

/**
 * Save a project (routes to localStorage or Supabase)
 */
export async function saveProject(
  projectData: ProjectJSON,
  metadata?: {
    difficulty?: string;
    purpose?: string;
    outputType?: string;
  },
  userId?: string | null
): Promise<ProjectRecord | null> {
  // For now, always use localStorage until auth is fully stable
  // TODO: Re-enable Supabase after auth stabilization
  return localProjects.saveLocalProject(projectData, metadata);
  
  /* Temporarily disabled - will re-enable after auth is stable
  if (userId) {
    return cloudProjects.saveCloudProject(userId, projectData, metadata);
  } else {
    return localProjects.saveLocalProject(projectData, metadata);
  }
  */
}

/**
 * Get all projects with optional filters
 */
export async function getProjects(
  filters?: ProjectFilters,
  userId?: string | null
): Promise<ProjectRecord[]> {
  // For now, always use localStorage until auth is fully stable
  // TODO: Re-enable Supabase after auth stabilization
  return localProjects.getLocalProjects(filters);
  
  /* Temporarily disabled - will re-enable after auth is stable
  if (userId) {
    return cloudProjects.getCloudProjects(userId, filters);
  } else {
    return localProjects.getLocalProjects(filters);
  }
  */
}

/**
 * Get a single project by ID
 */
export async function getProject(
  projectId: string,
  userId?: string | null
): Promise<ProjectRecord | null> {
  // For now, always use localStorage until auth is fully stable
  return localProjects.getLocalProject(projectId);
}

/**
 * Update a project
 */
export async function updateProject(
  projectId: string,
  updates: Partial<Pick<ProjectRecord, "title" | "isFavorite" | "projectData">>,
  userId?: string | null
): Promise<ProjectRecord | null> {
  // For now, always use localStorage until auth is fully stable
  return localProjects.updateLocalProject(projectId, updates);
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(
  projectId: string,
  isFavorite: boolean,
  userId?: string | null
): Promise<ProjectRecord | null> {
  // For now, always use localStorage until auth is fully stable
  return localProjects.toggleLocalFavorite(projectId, isFavorite);
}

/**
 * Delete a project
 */
export async function deleteProject(
  projectId: string,
  userId?: string | null
): Promise<boolean> {
  // For now, always use localStorage until auth is fully stable
  return localProjects.deleteLocalProject(projectId);
}

/**
 * Get project statistics
 */
export async function getProjectStats(
  userId?: string | null
): Promise<ProjectStats> {
  // For now, always use localStorage until auth is fully stable
  return localProjects.getLocalStats();
}

/**
 * Get recent projects (convenience method)
 */
export async function getRecentProjects(
  limit: number = 5,
  userId?: string | null
): Promise<ProjectRecord[]> {
  return getProjects({ limit, sortBy: "newest" }, userId);
}

/**
 * Get favorite projects (convenience method)
 */
export async function getFavoriteProjects(
  userId?: string | null
): Promise<ProjectRecord[]> {
  return getProjects({ favorite: true }, userId);
}

/**
 * Search projects by title (convenience method)
 */
export async function searchProjects(
  searchTerm: string,
  userId?: string | null
): Promise<ProjectRecord[]> {
  return getProjects({ search: searchTerm }, userId);
}

/**
 * Get projects by domain (convenience method)
 */
export async function getProjectsByDomain(
  domain: string,
  userId?: string | null
): Promise<ProjectRecord[]> {
  return getProjects({ domain }, userId);
}
