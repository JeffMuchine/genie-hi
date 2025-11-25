import os
from pypdf import PdfReader
from docx import Document
import json

def parse_resume(file_path: str, content_type: str) -> str:
    """
    Extract text from resume file based on extension/content_type
    """
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    
    try:
        if ext == ".pdf":
            reader = PdfReader(file_path)
            for page in reader.pages:
                text += page.extract_text() + "\n"
                
        elif ext == ".docx" or ext == ".docs": # .docs isn't standard but PRD mentioned it
            doc = Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
                
        elif ext == ".txt":
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
                
        elif ext == ".json":
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                text = json.dumps(data, indent=2)
                
        return text.strip()
    except Exception as e:
        print(f"Error parsing resume: {e}")
        return ""
