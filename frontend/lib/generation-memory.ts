/**
 * Generation Memory Service
 * Tracks recently generated project titles to prevent repetition
 */

const MEMORY_KEY = "majestic_generation_memory";
const MAX_MEMORY_SIZE = 10;

export interface GenerationMemory {
  titles: string[];
  timestamp: number;
}

/**
 * Get recent project titles from memory
 */
export function getGenerationMemory(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(MEMORY_KEY);
    if (!stored) return [];

    const memory: GenerationMemory = JSON.parse(stored);
    
    // Clear memory if older than 24 hours
    const dayInMs = 24 * 60 * 60 * 1000;
    if (Date.now() - memory.timestamp > dayInMs) {
      clearGenerationMemory();
      return [];
    }

    return memory.titles || [];
  } catch (error) {
    console.error("Error reading generation memory:", error);
    return [];
  }
}

/**
 * Add a new title to generation memory
 */
export function addToGenerationMemory(title: string): void {
  if (typeof window === "undefined") return;

  try {
    const currentMemory = getGenerationMemory();
    
    // Add new title and keep only last MAX_MEMORY_SIZE titles
    const updatedTitles = [title, ...currentMemory].slice(0, MAX_MEMORY_SIZE);

    const memory: GenerationMemory = {
      titles: updatedTitles,
      timestamp: Date.now(),
    };

    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch (error) {
    console.error("Error saving to generation memory:", error);
  }
}

/**
 * Clear generation memory
 */
export function clearGenerationMemory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(MEMORY_KEY);
}

/**
 * Get memory context for AI prompt
 */
export function getMemoryContext(): string {
  const recentTitles = getGenerationMemory();
  
  if (recentTitles.length === 0) {
    return "";
  }

  return `\n\nIMPORTANT: Do NOT generate ideas similar to these recently generated projects:\n${recentTitles.map((title, i) => `${i + 1}. ${title}`).join("\n")}\n\nGenerate a UNIQUE and DIFFERENT project idea.`;
}
