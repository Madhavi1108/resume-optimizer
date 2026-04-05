import json
import os
from google import genai
from typing import List

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

async def generate_questions(missing_skills: List[str], experience_level: str) -> List[str]:
    prompt = f"""
    You are a strict technical interviewer.
    Generate 5-10 targeted questions based on the candidate's missing skills: {', '.join(missing_skills)}.
    The target experience level is {experience_level}.
    Questions must be concise and actionable, to uncover if the candidate actually has experience with these or related skills, or to ask about weak experience / lack of quantified impact.
    Return strict JSON matching this structure:
    {{
        "questions": ["q1", "q2"]
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
        return data.get("questions", [])
    except Exception as e:
        print(f"Error generating questions: {e}")
        return ["Could you describe any projects where you learned a new technology quickly?"]
