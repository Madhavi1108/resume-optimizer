import json
import os
from google import genai

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

async def generate_resume_text(jd: str, original_resume: dict, user_answers: dict, github_projects: list) -> str:
    safe_projects = []
    for p in github_projects:
        if hasattr(p, 'model_dump'):
            safe_projects.append(p.model_dump())
        elif hasattr(p, 'dict'):
            safe_projects.append(p.dict())
        else:
            safe_projects.append(p)

    prompt = f"""
    You are an elite expert resume writer.

    Inputs:
    - Job Description: {jd}
    - Parsed Resume: {json.dumps(original_resume)}
    - User Answers: {json.dumps(user_answers)}
    - Selected GitHub Projects: {json.dumps(safe_projects)}

    Tasks:
    - Rewrite resume tailored to job
    - Optimize for ATS keywords
    - Use strong action verbs
    - Quantify achievements
    - Keep it concise (1 page)

    Output a clean, structured text format suitable for a resume. Do NOT wrap the output in markdown code blocks like ```markdown or ```text.
    Ensure sections for Skills, Experience, Projects, Education are clearly defined. Make it highly professional.
    """
    
    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-pro", # Use Pro for final text generation for higher quality
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Error generating resume text: {e}")
        return "Error generating resume. Please review logs."
