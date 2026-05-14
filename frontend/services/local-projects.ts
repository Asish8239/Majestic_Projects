/**
 * Local Storage Project Service
 * Handles localStorage persistence for guest users
 */

import { ProjectRecord, ProjectJSON, ProjectFilters, ProjectStats } from "@/types/project";

const STORAGE_KEY = "majestic_projects";

/**
 * Save a project to localStorage
 */
export async function saveLocalProject(
  projectData: ProjectJSON,
  metadata?: {
    difficulty?: string;
    purpose?: string;
    outputType?: string;
  }
): Promise<ProjectRecord> {
  const projects = await getLocalProjects();
  
  const newProject: ProjectRecord = {
    id: crypto.randomUUID(),
    title: projectData.title,
    domain: projectData.domain,
    projectData: projectData,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    difficulty: metadata?.difficulty,
    purpose: metadata?.purpose,
    outputType: metadata?.outputType,
  };
  
  projects.unshift(newProject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  
  return newProject;
}

/**
 * Get all projects from localStorage with optional filters
 */
export async function getLocalProjects(
  filters?: ProjectFilters
): Promise<ProjectRecord[]> {
  if (typeof window === "undefined") return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    let projects: ProjectRecord[] = JSON.parse(stored);
    
    // Apply filters
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      projects = projects.filter((p) =>
        p.title.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.domain) {
      projects = projects.filter((p) => p.domain === filters.domain);
    }
    
    if (filters?.favorite !== undefined) {
      projects = projects.filter((p) => p.isFavorite === filters.favorite);
    }
    
    // Apply sorting
    if (filters?.sortBy === "oldest") {
      projects.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (filters?.sortBy === "title") {
      projects.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: newest first
      projects.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    // Apply pagination
    if (filters?.offset !== undefined && filters?.limit !== undefined) {
      projects = projects.slice(filters.offset, filters.offset + filters.limit);
    } else if (filters?.limit !== undefined) {
      projects = projects.slice(0, filters.limit);
    }
    
    return projects;
  } catch (error) {
    console.error("Error parsing localStorage projects:", error);
    return [];
  }
}

/**
 * Get a single project by ID
 */
export async function getLocalProject(id: string): Promise<ProjectRecord | null> {
  const projects = await getLocalProjects();
  return projects.find((p) => p.id === id) || null;
}

/**
 * Update a project in localStorage
 */
export async function updateLocalProject(
  id: string,
  updates: Partial<Pick<ProjectRecord, "title" | "isFavorite" | "projectData">>
): Promise<ProjectRecord | null> {
  const projects = await getLocalProjects();
  const index = projects.findIndex((p) => p.id === id);
  
  if (index === -1) return null;
  
  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return projects[index];
}

/**
 * Toggle favorite status
 */
export async function toggleLocalFavorite(
  id: string,
  isFavorite: boolean
): Promise<ProjectRecord | null> {
  return updateLocalProject(id, { isFavorite });
}

/**
 * Delete a project from localStorage
 */
export async function deleteLocalProject(id: string): Promise<boolean> {
  const projects = await getLocalProjects();
  const filtered = projects.filter((p) => p.id !== id);
  
  if (filtered.length === projects.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Get project statistics
 */
export async function getLocalStats(): Promise<ProjectStats> {
  const projects = await getLocalProjects();
  
  const totalProjects = projects.length;
  const favoriteCount = projects.filter((p) => p.isFavorite).length;
  const uniqueDomains = new Set(projects.map((p) => p.domain)).size;
  const recentProjects = projects.slice(0, 5);
  
  return {
    totalProjects,
    favoriteCount,
    uniqueDomains,
    recentProjects,
  };
}

/**
 * Clear all projects (for testing/debugging)
 */
export async function clearLocalProjects(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
}
