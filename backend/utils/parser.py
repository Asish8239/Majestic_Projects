import json
import re
from typing import Dict, Any

def parse_json_response(response: str) -> Dict[str, Any]:
    """
    Parse JSON from LLM response with robust error handling.
    Handles cases where LLM returns markdown code blocks or extra text.
    """
    if not response or not response.strip():
        raise ValueError("Empty response from AI provider")
    
    # Remove leading/trailing whitespace
    response = response.strip()
    
    # Try to extract JSON from markdown code blocks
    json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', response, re.DOTALL)
    if json_match:
        response = json_match.group(1)
    
    # Try to find JSON object in the response
    json_match = re.search(r'\{.*\}', response, re.DOTALL)
    if json_match:
        response = json_match.group(0)
    
    # Parse JSON with multiple attempts
    for attempt in range(3):
        try:
            data = json.loads(response)
            return data
        except json.JSONDecodeError as e:
            if attempt < 2:  # Try to fix common issues
                response = fix_common_json_issues(response)
            else:
                raise ValueError(f"Failed to parse JSON after 3 attempts: {str(e)}\nResponse: {response[:500]}")


def fix_common_json_issues(json_str: str) -> str:
    """Fix common JSON formatting issues."""
    # Remove trailing commas
    json_str = re.sub(r',(\s*[}\]])', r'\1', json_str)
    
    # Fix unescaped quotes in strings (basic attempt)
    # Replace unescaped quotes that are not at the start/end of values
    json_str = re.sub(r'(?<!\\)"(?![,}\]\s])', r'\\"', json_str)
    
    # Fix missing quotes around keys
    json_str = re.sub(r'(\w+):', r'"\1":', json_str)
    
    # Fix single quotes to double quotes
    json_str = json_str.replace("'", '"')
    
    return json_str


def validate_project_data(data: Dict[str, Any]) -> None:
    """
    Validate that the project data has all required fields.
    Raises ValueError if validation fails.
    """
    required_fields = [
        "title",
        "domain",
        "problem_statement",
        "solution",
        "tech_stack",
        "abstract"
    ]
    
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
        
        if field == "tech_stack":
            if not isinstance(data[field], list) or len(data[field]) == 0:
                raise ValueError("tech_stack must be a non-empty list")
            # Ensure reasonable tech stack size
            if len(data[field]) > 10:
                data[field] = data[field][:10]  # Truncate if too long
        elif field == "abstract":
            validate_abstract(data[field])
        else:
            if not isinstance(data[field], str) or not data[field].strip():
                raise ValueError(f"{field} must be a non-empty string")


def validate_abstract(abstract: Dict[str, Any]) -> None:
    """Validate abstract structure."""
    required_abstract_fields = [
        "background",
        "objective",
        "methodology",
        "results",
        "conclusion"
    ]
    
    if not isinstance(abstract, dict):
        raise ValueError("abstract must be a dictionary")
    
    for field in required_abstract_fields:
        if field not in abstract:
            raise ValueError(f"Missing required abstract field: {field}")
        if not isinstance(abstract[field], str) or not abstract[field].strip():
            raise ValueError(f"abstract.{field} must be a non-empty string")


def validate_tech_stack(tech_stack: list) -> None:
    """
    Validate tech stack to ensure it's realistic.
    This is a basic validation - can be extended with a whitelist.
    """
    if len(tech_stack) < 2:
        raise ValueError("Tech stack should have at least 2 technologies")
    
    if len(tech_stack) > 10:
        raise ValueError("Tech stack should not exceed 10 technologies")
    
    for tech in tech_stack:
        if not isinstance(tech, str) or not tech.strip():
            raise ValueError("Each tech stack item must be a non-empty string")
