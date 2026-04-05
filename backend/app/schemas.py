from pydantic import BaseModel
from typing import List, Optional, Any

class JDParseResult(BaseModel):
    required_skills: List[str]
    preferred_skills: List[str]
    tools: List[str]
    experience_level: str
    ats_keywords: List[str]
    extracted_text: Optional[str] = None

class ResumeParseResult(BaseModel):
    skills: List[str]
    experience: List[dict]
    projects: List[dict]
    education: List[dict]

class GapAnalysisRequest(BaseModel):
    jd_skills: List[str]
    resume_skills: List[str]
    ats_keywords: List[str]

class GapAnalysisResult(BaseModel):
    missing_skills: List[str]
    matching_skills: List[str]
    keyword_gaps: List[str]
    match_percentage: int

class GenQuestionRequest(BaseModel):
    missing_skills: List[str]
    experience_level: str

class QuestionList(BaseModel):
    questions: List[str]

class ResumeGenerateRequest(BaseModel):
    job_description: str
    parsed_resume: dict
    user_answers: dict
    github_projects: List[dict]

class GitHubAnalyzeRequest(BaseModel):
    github_url: str
    job_description: str

class GithubRepo(BaseModel):
    name: str
    description: str
    stars: int
    url: str
    languages: List[str]
    relevance_score: int
    reason: str

class HistoryResponse(BaseModel):
    id: int
    job_title: str
    ats_score: int
    created_at: str
