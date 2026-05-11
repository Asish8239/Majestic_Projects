import { GenerateRequest, GenerateResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function generateProject(
  data: GenerateRequest
): Promise<GenerateResponse> {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || "Failed to generate project");
  }

  return response.json();
}

export async function regenerateProject(
  data: GenerateRequest,
  instruction: string
): Promise<GenerateResponse> {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      regenerate_instruction: instruction,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || "Failed to regenerate project");
  }

  return response.json();
}
