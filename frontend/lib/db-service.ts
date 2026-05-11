import { supabase } from "./supabase";
import { DBProject, ProjectJSON } from "./database.types";

/**
 * Database service for project operations
 */
export class DatabaseService {
  /**
   * Save a generated project to the database
   */
  static async saveProject(
    userId: string,
    projectData: {
      title: string;
      domain: string;
      difficulty?: string;
      purpose?: string;
      output_type?: string;
      project_json: ProjectJSON;
    }
  ): Promise<{ data: DBProject | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: userId,
          title: projectData.title,
          domain: projectData.domain,
          difficulty: projectData.difficulty || null,
          purpose: projectData.purpose || null,
          output_type: projectData.output_type || null,
          project_json: projectData.project_json as any,
          favorite: false,
        })
        .select()
        .single();

      return { data: data as DBProject | null, error };
    } catch (error) {
      console.error("Error saving project:", error);
      return { data: null, error };
    }
  }

  /**
   * Get all projects for a user
   */
  static async getUserProjects(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      domain?: string;
      favorite?: boolean;
      search?: string;
    }
  ): Promise<{ data: DBProject[] | null; error: any; count?: number }> {
    try {
      let query = supabase
        .from("projects")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      // Apply filters
      if (options?.domain) {
        query = query.eq("domain", options.domain);
      }

      if (options?.favorite !== undefined) {
        query = query.eq("favorite", options.favorite);
      }

      if (options?.search) {
        query = query.ilike("title", `%${options.search}%`);
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data, error, count } = await query;

      return { data: data as DBProject[] | null, error, count: count || 0 };
    } catch (error) {
      console.error("Error fetching projects:", error);
      return { data: null, error, count: 0 };
    }
  }

  /**
   * Get a single project by ID
   */
  static async getProject(
    projectId: string,
    userId: string
  ): Promise<{ data: DBProject | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .eq("user_id", userId)
        .single();

      return { data: data as DBProject | null, error };
    } catch (error) {
      console.error("Error fetching project:", error);
      return { data: null, error };
    }
  }

  /**
   * Update a project
   */
  static async updateProject(
    projectId: string,
    userId: string,
    updates: Partial<{
      title: string;
      favorite: boolean;
      project_json: ProjectJSON;
    }>
  ): Promise<{ data: DBProject | null; error: any }> {
    try {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.favorite !== undefined) updateData.favorite = updates.favorite;
      if (updates.project_json !== undefined) updateData.project_json = updates.project_json;

      const { data, error } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", projectId)
        .eq("user_id", userId)
        .select()
        .single();

      return { data: data as DBProject | null, error };
    } catch (error) {
      console.error("Error updating project:", error);
      return { data: null, error };
    }
  }

  /**
   * Toggle favorite status
   */
  static async toggleFavorite(
    projectId: string,
    userId: string,
    favorite: boolean
  ): Promise<{ data: DBProject | null; error: any }> {
    return this.updateProject(projectId, userId, { favorite });
  }

  /**
   * Delete a project
   */
  static async deleteProject(
    projectId: string,
    userId: string
  ): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .eq("user_id", userId);

      return { error };
    } catch (error) {
      console.error("Error deleting project:", error);
      return { error };
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string): Promise<{
    totalProjects: number;
    favoriteCount: number;
    uniqueDomains: number;
    recentProjects: DBProject[];
  }> {
    try {
      // Get all projects
      const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId);

      if (!projects) {
        return {
          totalProjects: 0,
          favoriteCount: 0,
          uniqueDomains: 0,
          recentProjects: [],
        };
      }

      // Cast to DBProject array
      const typedProjects = projects as unknown as DBProject[];

      // Calculate stats
      const totalProjects = typedProjects.length;
      const favoriteCount = typedProjects.filter((p) => p.favorite).length;
      const uniqueDomains = new Set(typedProjects.map((p) => p.domain)).size;
      const recentProjects = typedProjects
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5);

      return {
        totalProjects,
        favoriteCount,
        uniqueDomains,
        recentProjects,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return {
        totalProjects: 0,
        favoriteCount: 0,
        uniqueDomains: 0,
        recentProjects: [],
      };
    }
  }
}
