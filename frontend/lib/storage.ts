import { ProjectData } from "./types";

const STORAGE_KEY = "majestic_projects";

export function saveProject(project: Omit<ProjectData, "id" | "timestamp">): void {
  const projects = getProjects();
  const newProject: ProjectData = {
    ...project,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  
  projects.unshift(newProject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getProjects(): ProjectData[] {
  if (typeof window === "undefined") return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getRecentProjects(limit: number = 5): ProjectData[] {
  return getProjects().slice(0, limit);
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function clearAllProjects(): void {
  localStorage.removeItem(STORAGE_KEY);
}
