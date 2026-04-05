from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base
from datetime import datetime

class ResumeHistory(Base):
    __tablename__ = "resume_history"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String, index=True)
    ats_score = Column(Integer)
    original_resume_text = Column(Text)
    job_description_text = Column(Text)
    generated_resume_json = Column(Text) # storing structure
    created_at = Column(DateTime, default=datetime.utcnow)
