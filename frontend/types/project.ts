/**
 * Canonical Project Types
 * Single source of truth for all project-related types
 */

/**
 * Core project data structure (matches AI JSON output)
 */
export interface ProjectJSON {
  title: string;
  domain: string;
  problem_statement: string;
  solution: string;
  tech_stack: string[];
  abstract: {
    background: string;
    objective: string;
    methodology: string;
    results: string;
    conclusion: string;
  };
}

/**
 * Unified project record interface
 * Used across localStorage and Supabase
 */
export interface ProjectRecord {
  id: string;
  title: string;
  domain: string;
  projectData: ProjectJSON;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional metadata (from generator form)
  difficulty?: string;
  purpose?: string;
  outputType?: string;
}

/**
 * Project filters for search/filter operations
 */
export interface ProjectFilters {
  search?: string;
  domain?: string;
  favorite?: boolean;
  sortBy?: "newest" | "oldest" | "title";
  limit?: number;
  offset?: number;
}

/**
 * Project statistics
 */
export interface ProjectStats {
  totalProjects: number;
  favoriteCount: number;
  uniqueDomains: number;
  recentProjects: ProjectRecord[];
}

/**
 * Generator form data
 */
export interface GeneratorFormData {
  domain: string;
  difficulty: string;
  purpose: string;
  output_type: string;
}
