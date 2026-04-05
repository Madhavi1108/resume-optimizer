from ..schemas import GapAnalysisResult
from typing import List

def analyze_gap(jd_skills: List[str], resume_skills: List[str], ats_keywords: List[str]) -> GapAnalysisResult:
    jd_skills_lower = [s.lower() for s in jd_skills]
    resume_skills_lower = [s.lower() for s in resume_skills]
    ats_keywords_lower = [k.lower() for k in ats_keywords]
    
    matching_skills = [s for s in jd_skills if s.lower() in resume_skills_lower]
    missing_skills = [s for s in jd_skills if s.lower() not in resume_skills_lower]
    keyword_gaps = [k for k in ats_keywords if k.lower() not in resume_skills_lower]
    
    total_important = len(jd_skills) + len(ats_keywords)
    matched = len(matching_skills) + (len(ats_keywords) - len(keyword_gaps))
    match_percentage = int((matched / total_important) * 100) if total_important > 0 else 100
    
    return GapAnalysisResult(
        missing_skills=missing_skills,
        matching_skills=matching_skills,
        keyword_gaps=keyword_gaps,
        match_percentage=match_percentage
    )
