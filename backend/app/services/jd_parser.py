import json
import os
from google import genai
from ..schemas import JDParseResult

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

async def parse_jd(jd_text: str) -> JDParseResult:
    prompt = f"""
    You are a specialized HR technical parsing assistant.
    Extract the following from this job description:
    - Required skills
    - Preferred skills
    - Tools/technologies
    - Experience level
    - Important ATS keywords

    Return strict JSON matching this structure:
    {{
      "required_skills": ["skill1", "skill2"],
      "preferred_skills": ["skill1", "skill2"],
      "tools": ["tool1", "tool2"],
      "experience_level": "Mid-Level",
      "ats_keywords": ["keyword1", "keyword2"]
    }}

    Job Description:
    {jd_text}
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
        return JDParseResult(**data)
    except Exception as e:
        print(f"Error parsing JD: {e}")
        return JDParseResult(required_skills=[], preferred_skills=[], tools=[], experience_level="Entry-Level", ats_keywords=[])
