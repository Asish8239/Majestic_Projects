import os
import json
import httpx
from typing import Optional

class LLMService:
    """
    LLM Service with robust fallback support:
    1. Primary: Groq API (fast + free tier)
    2. Fallback: Hugging Face Inference API
    3. Emergency: Hardcoded fallback response
    """
    
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.hf_api_key = os.getenv("HF_API_KEY")
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.ollama_model = os.getenv("OLLAMA_MODEL", "llama2")
        
        # Determine available providers
        self.providers = []
        if self.groq_api_key and self.groq_api_key != "your_groq_api_key_here":
            self.providers.append("groq")
        if self.hf_api_key and self.hf_api_key != "your_huggingface_api_key_here":
            self.providers.append("huggingface")
        
        print(f"Available AI providers: {self.providers}")
    
    def get_emergency_fallback(self, domain: str = "AI") -> str:
        """Return a hardcoded fallback response when all APIs fail."""
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
            }
        }
        
        # Get fallback for specific domain or default to AI
        fallback = fallback_projects.get(domain, fallback_projects["AI"])
        return json.dumps(fallback)
    
    async def generate(self, prompt: str, domain: str = "AI") -> str:
        """
        Generate text using available AI providers with robust fallback.
        CRITICAL: This function NEVER fails - always returns valid JSON.
        """
        errors = []
        
        # Try Groq first
        if "groq" in self.providers:
            for attempt in range(2):  # 2 attempts for Groq
                try:
                    print(f"Trying Groq (attempt {attempt + 1})")
                    result = await self._generate_groq(prompt)
                    if result and result.strip():
                        # Validate JSON before returning
                        if self._is_valid_json(result):
                            print("✅ Groq succeeded with valid JSON")
                            return result
                        else:
                            print("⚠️ Groq returned invalid JSON, retrying...")
                            continue
                except Exception as e:
                    error_msg = f"Groq (attempt {attempt + 1}): {str(e)}"
                    errors.append(error_msg)
                    print(f"❌ Groq failed: {error_msg}")
                    continue
        
        # Try Hugging Face if Groq failed
        if "huggingface" in self.providers:
            for attempt in range(2):  # 2 attempts for HF
                try:
                    print(f"Trying Hugging Face (attempt {attempt + 1})")
                    result = await self._generate_huggingface(prompt)
                    if result and result.strip():
                        # Validate JSON before returning
                        if self._is_valid_json(result):
                            print("✅ Hugging Face succeeded with valid JSON")
                            return result
                        else:
                            print("⚠️ Hugging Face returned invalid JSON, retrying...")
                            continue
                except Exception as e:
                    error_msg = f"HuggingFace (attempt {attempt + 1}): {str(e)}"
                    errors.append(error_msg)
                    print(f"❌ Hugging Face failed: {error_msg}")
                    continue
        
        # Emergency fallback - ALWAYS works
        print(f"🚨 All AI providers failed. Using emergency fallback for domain: {domain}")
        print(f"Errors encountered: {'; '.join(errors)}")
        return self.get_emergency_fallback(domain)
    
    def _is_valid_json(self, text: str) -> bool:
        """Check if text contains valid JSON."""
        try:
            import json
            # Try to extract JSON from the text
            import re
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                json.loads(json_match.group(0))
                return True
            return False
        except:
            return False
    
    async def _generate_groq(self, prompt: str) -> str:
        """Generate using Groq API with fallback model."""
        try:
            from groq import Groq
            
            client = Groq(api_key=self.groq_api_key)
            
            # Try primary model first
            try:
                response = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",  # Updated current model
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a helpful assistant that returns only valid JSON responses."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.9,  # Increased for more creativity and diversity
                    max_tokens=2000,
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"Primary Groq model failed, trying fallback: {e}")
                # Try fallback model
                response = client.chat.completions.create(
                    model="llama-3.1-8b-instant",  # Updated fallback model
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a helpful assistant that returns only valid JSON responses."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.9,  # Increased for more creativity and diversity
                    max_tokens=2000,
                )
                return response.choices[0].message.content
            
        except Exception as e:
            raise Exception(f"Groq API error: {str(e)}")
    
    async def _generate_huggingface(self, prompt: str) -> str:
        """Generate using Hugging Face Inference API."""
        try:
            url = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
            
            headers = {
                "Authorization": f"Bearer {self.hf_api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 2000,
                    "temperature": 0.9,  # Increased for more creativity and diversity
                    "return_full_text": False
                }
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                response.raise_for_status()
                
                result = response.json()
                
                # Handle different response formats
                if isinstance(result, list) and len(result) > 0:
                    return result[0].get("generated_text", "")
                elif isinstance(result, dict):
                    return result.get("generated_text", "")
                else:
                    raise ValueError("Unexpected response format from Hugging Face")
                    
        except Exception as e:
            raise Exception(f"Hugging Face API error: {str(e)}")
    
    async def _generate_ollama(self, prompt: str) -> str:
        """Generate using local Ollama instance (optional)."""
        try:
            url = f"{self.ollama_base_url}/api/generate"
            
            payload = {
                "model": self.ollama_model,
                "prompt": prompt,
                "stream": False
            }
            
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                
                result = response.json()
                return result.get("response", "")
                
        except Exception as e:
            raise Exception(f"Ollama error: {str(e)}")
