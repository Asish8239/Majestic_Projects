/**
 * Cloud Storage Project Service
 * Handles Supabase persistence for authenticated users
 */

import { supabase } from "@/lib/supabase";
import { ProjectRecord, ProjectJSON, ProjectFilters, ProjectStats } from "@/types/project";
import { DBProject } from "@/lib/database.types";

/**
 * Convert database project to unified ProjectRecord
 */
function dbToProjectRecord(dbProject: DBProject): ProjectRecord {
  return {
    id: dbProject.id,
    title: dbProject.title,
    domain: dbProject.domain,
    projectData: dbProject.project_json,
    isFavorite: dbProject.favorite,
    createdAt: dbProject.created_at,
    updatedAt: dbProject.updated_at,
    difficulty: dbProject.difficulty || undefined,
    purpose: dbProject.purpose || undefined,
    outputType: dbProject.output_type || undefined,
  };
}

/**
 * Save a project to Supabase
 */
export async function saveCloudProject(
  userId: string,
  projectData: ProjectJSON,
  metadata?: {
    difficulty?: string;
    purpose?: string;
    outputType?: string;
  }
): Promise<ProjectRecord | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: userId,
        title: projectData.title,
        domain: projectData.domain,
        difficulty: metadata?.difficulty || null,
        purpose: metadata?.purpose || null,
        output_type: metadata?.outputType || null,
        project_json: projectData as any,
        favorite: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving project to cloud:", error);
      return null;
    }

    return dbToProjectRecord(data as unknown as DBProject);
  } catch (error) {
    console.error("Error saving project to cloud:", error);
    return null;
  }
}

/**
 * Get all projects from Supabase with optional filters
 */
export async function getCloudProjects(
  userId: string,
  filters?: ProjectFilters
): Promise<ProjectRecord[]> {
  try {
    let query = supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId);

    // Apply filters
    if (filters?.domain) {
      query = query.eq("domain", filters.domain);
    }

    if (filters?.favorite !== undefined) {
      query = query.eq("favorite", filters.favorite);
    }

    if (filters?.search) {
      query = query.ilike("title", `%${filters.search}%`);
    }

    // Apply sorting
    if (filters?.sortBy === "oldest") {
      query = query.order("created_at", { ascending: true });
    } else if (filters?.sortBy === "title") {
      query = query.order("title", { ascending: true });
    } else {
      // Default: newest first
      query = query.order("created_at", { ascending: false });
    }

    // Apply pagination
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching projects from cloud:", error);
      return [];
    }

    return (data as unknown as DBProject[]).map(dbToProjectRecord);
  } catch (error) {
    console.error("Error fetching projects from cloud:", error);
    return [];
  }
}

/**
 * Get a single project by ID
 */
export async function getCloudProject(
  userId: string,
  projectId: string
): Promise<ProjectRecord | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching project from cloud:", error);
      return null;
    }

    return dbToProjectRecord(data as unknown as DBProject);
  } catch (error) {
    console.error("Error fetching project from cloud:", error);
    return null;
  }
}

/**
 * Update a project in Supabase
 */
export async function updateCloudProject(
  userId: string,
  projectId: string,
  updates: Partial<Pick<ProjectRecord, "title" | "isFavorite" | "projectData">>
): Promise<ProjectRecord | null> {
  try {
    const updateData: any = {};
    
    if (updates.title !== undefined) {
      updateData.title = updates.title;
    }
    
    if (updates.isFavorite !== undefined) {
      updateData.favorite = updates.isFavorite;
    }
    
    if (updates.projectData !== undefined) {
      updateData.project_json = updates.projectData;
    }

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", projectId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating project in cloud:", error);
      return null;
    }

    return dbToProjectRecord(data as unknown as DBProject);
  } catch (error) {
    console.error("Error updating project in cloud:", error);
    return null;
  }
}

/**
 * Toggle favorite status
 */
export async function toggleCloudFavorite(
  userId: string,
  projectId: string,
  isFavorite: boolean
): Promise<ProjectRecord | null> {
  return updateCloudProject(userId, projectId, { isFavorite });
}

/**
 * Delete a project from Supabase
 */
export async function deleteCloudProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting project from cloud:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting project from cloud:", error);
    return false;
  }
}

/**
 * Get project statistics
 */
export async function getCloudStats(userId: string): Promise<ProjectStats> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId);

    if (error || !data) {
      return {
        totalProjects: 0,
        favoriteCount: 0,
        uniqueDomains: 0,
        recentProjects: [],
      };
    }

    const projects = (data as unknown as DBProject[]).map(dbToProjectRecord);
    
    const totalProjects = projects.length;
    const favoriteCount = projects.filter((p) => p.isFavorite).length;
    const uniqueDomains = new Set(projects.map((p) => p.domain)).size;
    const recentProjects = projects
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    return {
      totalProjects,
      favoriteCount,
      uniqueDomains,
      recentProjects,
    };
  } catch (error) {
    console.error("Error fetching cloud stats:", error);
    return {
      totalProjects: 0,
      favoriteCount: 0,
      uniqueDomains: 0,
      recentProjects: [],
    };
  }
}
