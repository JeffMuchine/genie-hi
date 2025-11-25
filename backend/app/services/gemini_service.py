import google.generativeai as genai
from app.core.config import settings
import json

class GeminiService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        else:
            self.model = None

    async def generate_resume_insights(self, resume_text: str) -> dict:
        if not self.model:
            return {
                "experience_level": "Mid-Level (Mock)",
                "encouraging_note": "You have a solid background! Let's highlight your key achievements."
            }
            
        prompt = f"""
        Analyze the following resume text and provide:
        1. Experience Level (Entry, Mid, Senior, Executive)
        2. A brief, encouraging note (max 2 sentences) highlighting a strength.
        
        Resume Text:
        {resume_text[:2000]}... (truncated)
        
        Return JSON format:
        {{
            "experience_level": "Level",
            "encouraging_note": "Note"
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            # Simple cleanup to ensure JSON
            text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)
        except Exception as e:
            print(f"Gemini Error: {e}")
            return {
                "experience_level": "Analysis Failed",
                "encouraging_note": "We couldn't analyze your resume right now, but you're good to go!"
            }

    async def tailor_resume(self, resume_text: str, job_description: str) -> dict:
        if not self.model:
            return {
                "sections": [
                    {
                        "section_id": "summary",
                        "title": "Professional Summary",
                        "original_content": "Original summary...",
                        "tailored_content": "Tailored summary for this job...",
                        "status": "pending"
                    }
                ]
            }
            
        prompt = f"""
        You are an expert resume writer. Tailor the resume below for the job description provided.
        
        Job Description:
        {job_description[:2000]}...
        
        Resume:
        {resume_text[:2000]}...
        
        Instructions:
        1. Identify key sections to improve (Summary, Experience, Skills).
        2. Rewrite them to match keywords and requirements from the job description.
        3. Return a JSON object with a list of sections.
        
        Format:
        {{
            "sections": [
                {{
                    "section_id": "unique_id",
                    "title": "Section Title",
                    "original_content": "Original text",
                    "tailored_content": "Rewritten text",
                    "status": "pending"
                }}
            ]
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(text)
        except Exception as e:
            print(f"Gemini Error: {e}")
            return {"sections": []}

    async def generate_cover_letter(self, resume_text: str, job_description: str, tone: str, length: str, highlights: list) -> str:
        if not self.model:
            return f"Dear Hiring Manager,\n\nThis is a mock cover letter ({tone}, {length})...\n\nSincerely,\nCandidate"
            
        prompt = f"""
        Write a cover letter for the following job application.
        
        Tone: {tone}
        Length: {length}
        Key Highlights to include: {', '.join(highlights) if highlights else 'None specified'}
        
        Job Description:
        {job_description[:1000]}...
        
        Resume Context:
        {resume_text[:1000]}...
        
        Return ONLY the cover letter text.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Gemini Error: {e}")
            return "Error generating cover letter."

gemini_service = GeminiService()
