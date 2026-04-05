import pdfplumber
import io
import json
import os
from google import genai
from ..schemas import ResumeParseResult

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text

async def process_resume(file_bytes: bytes):
    text = extract_text_from_pdf(file_bytes)
    prompt = f"""
    You are a resume parsing assistant.
    Extract the following into structured JSON:
    - skills
    - experience (list of objects: title, company, dates, description)
    - projects (list of objects: name, description, tools)
    - education (list of objects: degree, school, year)

    Return strict JSON matching this structure:
    {{
        "skills": ["skill1", "skill2"],
        "experience": [],
        "projects": [],
        "education": []
    }}

    Resume text:
    {text}
    """
    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        structured_data = json.loads(response.text)
        return ResumeParseResult(**structured_data), text
    except Exception as e:
        print(f"Error parsing Resume: {e}")
        return ResumeParseResult(skills=[], experience=[], projects=[], education=[]), text
