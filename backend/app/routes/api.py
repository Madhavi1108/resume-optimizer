from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from ..database import get_db
from ..models import ResumeHistory
from ..schemas import (
    JDParseResult, ResumeParseResult, GapAnalysisResult, QuestionList, 
    GapAnalysisRequest, GenQuestionRequest, GitHubAnalyzeRequest, 
    GithubRepo, ResumeGenerateRequest
)
from ..services.jd_parser import parse_jd
from ..services.resume_parser import process_resume, extract_text_from_pdf
from ..services.gap_analysis import analyze_gap
from ..services.question_generator import generate_questions
from ..services.github_analyzer import analyze_github
from ..services.resume_generator import generate_resume_text
from ..services.pdf_generator import create_pdf
from ..services.docx_generator import create_docx

router = APIRouter()

@router.post("/parse-jd", response_model=JDParseResult)
async def api_parse_jd(
    file: Optional[UploadFile] = File(None),
    jd_text: Optional[str] = Form(None)
):
    text = ""
    if file:
        contents = await file.read()
        if file.filename.lower().endswith('.pdf'):
            text = extract_text_from_pdf(contents)
        else:
            text = contents.decode('utf-8', errors='ignore')
    elif jd_text:
        text = jd_text
    else:
        raise HTTPException(status_code=400, detail="Job description text or file is required")
        
    result = await parse_jd(text)
    result.extracted_text = text
    return result


@router.post("/parse-resume", response_model=ResumeParseResult)
async def api_parse_resume(file: UploadFile = File(...)):
    contents = await file.read()
    parsed_model, text = await process_resume(contents)
    return parsed_model


@router.post("/analyze-gap", response_model=GapAnalysisResult)
async def api_analyze_gap(request: GapAnalysisRequest):
    return analyze_gap(request.jd_skills, request.resume_skills, request.ats_keywords)


@router.post("/generate-questions", response_model=QuestionList)
async def api_generate_questions(request: GenQuestionRequest):
    qs = await generate_questions(request.missing_skills, request.experience_level)
    return QuestionList(questions=qs)


@router.post("/analyze-github", response_model=List[GithubRepo])
async def api_analyze_github(request: GitHubAnalyzeRequest):
    return await analyze_github(request.github_url, request.job_description)


@router.post("/generate-resume")
async def api_generate_resume(request: ResumeGenerateRequest, db: Session = Depends(get_db)):
    resume_text = await generate_resume_text(
        request.job_description,
        request.parsed_resume,
        request.user_answers,
        request.github_projects
    )
    
    # Save to history
    new_history = ResumeHistory(
        job_title="Generated via AI",
        ats_score=0, # Could be calculated separately
        original_resume_text=json.dumps(request.parsed_resume),
        job_description_text=request.job_description,
        generated_resume_json=resume_text
    )
    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    
    return {"resume_text": resume_text, "history_id": new_history.id}


@router.post("/export-pdf")
async def api_export_pdf(text: str = Form(...)):
    # Minimal version: text passed as form, returns PDF stream
    pdf_bytes = create_pdf(text)
    return Response(content=pdf_bytes, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=optimized_resume.pdf"
    })

@router.post("/export-docx")
async def api_export_docx(text: str = Form(...)):
    docx_bytes = create_docx(text)
    return Response(content=docx_bytes, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={
        "Content-Disposition": "attachment; filename=optimized_resume.docx"
    })


@router.get("/history")
async def api_history(db: Session = Depends(get_db)):
    items = db.query(ResumeHistory).order_by(ResumeHistory.created_at.desc()).all()
    return items
