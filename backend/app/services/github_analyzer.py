import httpx
import json
import os
from google import genai
from typing import List
from ..schemas import GithubRepo

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

async def analyze_github(github_url: str, job_description: str) -> List[GithubRepo]:
    username = github_url.strip("/").split("/")[-1]
    api_url = f"https://api.github.com/users/{username}/repos?sort=updated&per_page=10"
    
    async with httpx.AsyncClient() as http_client:
        response = await http_client.get(api_url)
        if response.status_code != 200:
            return []
        repos = response.json()
        
    repo_summaries = []
    for r in repos:
        repo_summaries.append({
            "name": r.get("name"),
            "description": r.get("description"),
            "stars": r.get("stargazers_count"),
            "url": r.get("html_url"),
            "language": r.get("language")
        })
        
    prompt = f"""
    You are a technical recruiter evaluating GitHub portfolios.
    Here is a list of a candidate's GitHub repositories:
    {json.dumps(repo_summaries)}
    
    Job Description:
    {job_description}
    
    Rank the top 3 projects relevant to the job description. Explain relevance.
    Return strict JSON matching this structure:
    {{
        "top_projects": [
            {{
                "name": "repo_name",
                "description": "repo description",
                "stars": 0,
                "url": "repo_url",
                "languages": ["lang1"],
                "relevance_score": 95,
                "reason": "explanation"
            }}
        ]
    }}
    """
    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        data = json.loads(response.text)
        result = []
        for p in data.get("top_projects", []):
            if isinstance(p.get("languages"), str):
                p["languages"] = [p.get("languages")]
            elif not p.get("languages"):
                p["languages"] = []
            result.append(GithubRepo(**p))
        return result
    except Exception as e:
        print(f"Error in analyze_github: {e}")
        return []
