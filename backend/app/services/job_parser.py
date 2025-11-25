import httpx
from bs4 import BeautifulSoup
import re
from typing import Tuple

async def parse_job_input(input_data: str) -> Tuple[str, str, str]:
    """
    Parse job input (URL or text) to extract title, company, and description.
    Returns (job_title, company_name, job_description)
    """
    # Check if input is a URL
    url_pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
    
    if url_pattern.match(input_data):
        try:
            async with httpx.AsyncClient(follow_redirects=True) as client:
                response = await client.get(input_data, timeout=10.0)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Try to get title from og:title
                title = ""
                og_title = soup.find("meta", property="og:title")
                if og_title:
                    title = og_title.get("content", "")
                
                if not title:
                    title_tag = soup.find("title")
                    if title_tag:
                        title = title_tag.text.strip()
                
                # Try to get company from og:site_name
                company = ""
                og_site_name = soup.find("meta", property="og:site_name")
                if og_site_name:
                    company = og_site_name.get("content", "")
                
                # Fallback heuristics
                if " | " in title:
                    parts = title.split(" | ")
                    if not company and len(parts) > 1:
                        company = parts[-1]
                        title = " | ".join(parts[:-1])
                elif " - " in title:
                    parts = title.split(" - ")
                    if not company and len(parts) > 1:
                        company = parts[-1]
                        title = " - ".join(parts[:-1])
                        
                if not title:
                    title = "Unknown Job"
                if not company:
                    company = "Unknown Company"
                    
                # Get description (naive: all text)
                # Ideally we'd look for specific containers, but that varies by site
                description = soup.get_text(separator="\n", strip=True)
                
                return title, company, description
                
        except Exception as e:
            print(f"Error scraping URL: {e}")
            return "Job from URL", "Unknown Company", f"Failed to scrape: {input_data}"
            
    else:
        # It's text input
        lines = input_data.strip().split("\n")
        title = lines[0] if lines else "Unknown Job"
        company = "Unknown Company" # Hard to guess from raw text without AI
        description = input_data
        
        return title, company, description
