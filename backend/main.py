from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import os
from dotenv import load_dotenv

from services.llm_service import LLMService
from utils.parser import parse_json_response, validate_project_data

load_dotenv()

app = FastAPI(
    title="Majestic Projects API",
    description="AI-powered project generator API",
    version="1.0.0"
)

# CORS Configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM Service
llm_service = LLMService()


class GenerateRequest(BaseModel):
    domain: str = Field(..., description="Project domain (AI, Web Dev, IoT, etc.)")
    difficulty: str = Field(..., description="Difficulty level (Beginner, Intermediate, Advanced)")
    purpose: str = Field(..., description="Purpose (Academic, Portfolio, Startup)")
    output_type: str = Field(..., description="Output type (Idea Only, Abstract, Full Project)")
    regenerate_instruction: Optional[str] = Field(None, description="Instruction for regeneration")
    memory_context: Optional[str] = Field(None, description="Context of previously generated projects to avoid repetition")


class AbstractModel(BaseModel):
    background: str
    objective: str
    methodology: str
    results: str
    conclusion: str


class GenerateResponse(BaseModel):
    title: str
    domain: str
    problem_statement: str
    solution: str
    tech_stack: list[str]
    abstract: AbstractModel


@app.get("/")
async def root():
    return {
        "message": "Majestic Projects API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/generate", response_model=GenerateResponse)
async def generate_project(request: GenerateRequest):
    """
    Generate a project based on user parameters.
    Returns structured JSON with project details and academic abstract.
    CRITICAL: This endpoint NEVER fails - always returns valid JSON.
    """
    try:
        # Build the prompt
        prompt = build_prompt(request)
        
        # Generate with robust fallback logic
        max_retries = 3
        for attempt in range(max_retries):
            try:
                print(f"🎯 Generation attempt {attempt + 1} for domain: {request.domain}")
                
                # Call LLM service with domain for better fallback
                raw_response = await llm_service.generate(prompt, request.domain)
                
                # Parse and validate JSON
                project_data = parse_json_response(raw_response)
                validate_project_data(project_data)
                
                print(f"✅ Successfully generated project: {project_data.get('title', 'Unknown')}")
                return GenerateResponse(**project_data)
                
            except ValueError as e:
                print(f"⚠️ JSON parsing failed (attempt {attempt + 1}): {str(e)}")
                if attempt == max_retries - 1:
                    # Final attempt failed, use emergency fallback
                    print("🚨 All parsing attempts failed, using emergency fallback")
                    emergency_data = get_emergency_fallback_dict(request.domain)
                    return GenerateResponse(**emergency_data)
                # Retry with stricter prompt
                prompt = build_prompt(request, strict_json=True)
                continue
                
    except Exception as e:
        print(f"🚨 Critical error in generate_project: {str(e)}")
        # Emergency fallback for any unexpected errors
        emergency_data = get_emergency_fallback_dict(request.domain)
        return GenerateResponse(**emergency_data)


def get_emergency_fallback_dict(domain: str = "AI") -> dict:
    """Get emergency fallback as dictionary for direct use."""
    fallback_projects = {
        "AI": {
            "title": "AI-Based Resume Analyzer",
            "domain": "AI",
            "problem_statement": "Manual resume screening is time-consuming and inefficient for HR departments.",
            "solution": "Develop an AI system that uses NLP to automatically analyze and rank resumes based on job requirements.",
            "tech_stack": ["Python", "NLP", "React", "Flask", "scikit-learn"],
            "abstract": {
                "background": "Recruitment processes are increasingly time-consuming as companies receive hundreds of applications.",
                "objective": "Automate resume screening to improve hiring efficiency and reduce bias.",
                "methodology": "Use NLP techniques and machine learning models to extract and analyze resume content.",
                "results": "Faster hiring process with improved candidate matching accuracy.",
                "conclusion": "AI-powered resume analysis significantly improves recruitment efficiency."
            }
        },
        "Web Development": {
            "title": "Real-time Collaborative Task Manager",
            "domain": "Web Development",
            "problem_statement": "Teams struggle with task coordination and real-time collaboration.",
            "solution": "Build a web application with real-time updates and collaborative features.",
            "tech_stack": ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
            "abstract": {
                "background": "Remote teams need better tools for task management and collaboration.",
                "objective": "Create a real-time collaborative platform for team task management.",
                "methodology": "Use WebSocket technology and modern web frameworks for real-time updates.",
                "results": "Improved team coordination and productivity.",
                "conclusion": "Real-time collaboration tools enhance team efficiency."
            }
        },
        "IoT": {
            "title": "Smart Home Energy Management System",
            "domain": "IoT",
            "problem_statement": "Homeowners lack visibility into energy consumption patterns and waste energy.",
            "solution": "Create an IoT system that monitors and optimizes home energy usage automatically.",
            "tech_stack": ["Arduino", "Raspberry Pi", "MQTT", "Python", "React"],
            "abstract": {
                "background": "Rising energy costs and environmental concerns drive need for smart energy management.",
                "objective": "Develop an automated system to monitor and optimize residential energy consumption.",
                "methodology": "Deploy IoT sensors and smart switches with machine learning optimization algorithms.",
                "results": "Reduced energy consumption and lower utility bills for homeowners.",
                "conclusion": "IoT-based energy management provides significant cost and environmental benefits."
            }
        }
    }
    
    # Get fallback for specific domain or default to AI
    return fallback_projects.get(domain, fallback_projects["AI"])


def build_prompt(request: GenerateRequest, strict_json: bool = False) -> str:
    """Build the prompt for the LLM based on request parameters."""
    
    # Randomized innovation angles for diversity
    import random
    innovation_angles = [
        "real-time analytics and live monitoring",
        "AI-powered automation and intelligent workflows",
        "sustainability and environmental impact",
        "edge computing and distributed intelligence",
        "predictive intelligence and forecasting",
        "blockchain integration and decentralization",
        "voice interfaces and conversational AI",
        "automation workflows and process optimization",
        "privacy-first and zero-trust architecture",
        "cross-platform and multi-device synchronization",
    ]
    
    # Randomized project categories for architectural diversity
    project_categories = [
        "SaaS platform",
        "analytics dashboard",
        "AI assistant",
        "mobile-first application",
        "enterprise system",
        "automation engine",
        "IoT platform",
        "research-grade system",
        "developer tool",
        "monitoring system",
    ]
    
    selected_angle = random.choice(innovation_angles)
    selected_category = random.choice(project_categories)
    
    base_instruction = f"""You are an expert academic and industry project designer specializing in interdisciplinary innovation. Generate realistic, implementable, and HIGHLY UNIQUE project ideas.

CRITICAL DIVERSITY REQUIREMENTS:
- Generate a UNIQUE and NON-REPETITIVE project idea
- Avoid generic CRUD systems and overused concepts
- DO NOT generate repetitive healthcare chatbots, basic resume analyzers, or simple voting platforms
- The project MUST differ significantly in architecture, workflow, implementation strategy, and problem statement
- Focus on interdisciplinary innovation combining multiple domains creatively
- Prioritize {selected_angle}
- Design as a {selected_category}

CRITICAL: You MUST return ONLY valid JSON. No markdown, no explanations, no additional text. Just pure JSON."""

    if strict_json:
        base_instruction += "\n\nYour previous response was not valid JSON. This time, return ONLY the JSON object with no additional formatting or text."

    json_schema = """{
  "title": "Project title (concise, professional, and UNIQUE)",
  "domain": "The domain category",
  "problem_statement": "Clear description of a REAL and SPECIFIC problem (2-3 sentences)",
  "solution": "Detailed and INNOVATIVE solution approach (3-4 sentences)",
  "tech_stack": ["Technology 1", "Technology 2", "Technology 3", "Technology 4", "Technology 5"],
  "abstract": {
    "background": "Background context with real-world relevance (2-3 sentences)",
    "objective": "Main objective that is specific and measurable (1-2 sentences)",
    "methodology": "Approach and methods with technical depth (2-3 sentences)",
    "results": "Expected outcomes with quantifiable impact (1-2 sentences)",
    "conclusion": "Summary and broader impact (1-2 sentences)"
  }
}"""

    regenerate_context = ""
    if request.regenerate_instruction:
        if request.regenerate_instruction == "make_innovative":
            regenerate_context = "\n\nMake this project MORE INNOVATIVE with cutting-edge technologies and unique approaches."
        elif request.regenerate_instruction == "simplify":
            regenerate_context = "\n\nSIMPLIFY this project to make it more beginner-friendly and easier to implement."
        else:
            regenerate_context = "\n\nGenerate a COMPLETELY DIFFERENT project with the same parameters."

    prompt = f"""{base_instruction}

Generate a {request.difficulty} level project combining: {request.domain}
Purpose: {request.purpose}
Output type: {request.output_type}

{regenerate_context}

QUALITY REQUIREMENTS:
- Tech stack must be realistic, modern, and free/open-source
- Project must be buildable on a standard laptop (i5 processor level)
- Avoid buzzwords and vague concepts
- Ensure the project is practical and implementable
- Tech stack should have 4-6 technologies
- Focus on INTERDISCIPLINARY innovation
- Avoid repetitive patterns from common academic projects

INNOVATION FOCUS:
- Emphasize {selected_angle}
- Design as a {selected_category}
- Combine domains in unexpected and creative ways
- Prioritize technical depth and real-world applicability

{request.memory_context or ""}

Return ONLY this JSON structure:
{json_schema}

Remember: Return ONLY the JSON object. No markdown code blocks, no explanations."""

    return prompt


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
