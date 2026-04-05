import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const parseJd = async (data) => {
    const formData = new FormData();
    if (data instanceof File) {
        formData.append('file', data);
    } else {
        formData.append('jd_text', data);
    }
    const response = await axios.post(`${API_URL}/parse-jd`, formData);
    return response.data;
};

export const parseResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/parse-resume`, formData);
    return response.data;
};

export const analyzeGap = async (jdSkills, resumeSkills, atsKeywords) => {
    const response = await axios.post(`${API_URL}/analyze-gap`, {
        jd_skills: jdSkills,
        resume_skills: resumeSkills,
        ats_keywords: atsKeywords
    });
    return response.data;
};

export const generateQuestions = async (missingSkills, experienceLevel) => {
    const response = await axios.post(`${API_URL}/generate-questions`, {
        missing_skills: missingSkills,
        experience_level: experienceLevel
    });
    return response.data;
};

export const analyzeGithub = async (githubUrl, jobDescription) => {
    const response = await axios.post(`${API_URL}/analyze-github`, {
        github_url: githubUrl,
        job_description: jobDescription
    });
    return response.data;
};

export const generateResume = async (jobDescription, parsedResume, userAnswers, githubProjects) => {
    const response = await axios.post(`${API_URL}/generate-resume`, {
        job_description: jobDescription,
        parsed_resume: parsedResume,
        user_answers: userAnswers,
        github_projects: githubProjects
    });
    return response.data;
};

export const exportPdf = async (resumeText) => {
    const formData = new FormData();
    formData.append('text', resumeText);
    const response = await axios.post(`${API_URL}/export-pdf`, formData, {
        responseType: 'blob'
    });
    return response.data;
};

export const exportDocx = async (resumeText) => {
    const formData = new FormData();
    formData.append('text', resumeText);
    const response = await axios.post(`${API_URL}/export-docx`, formData, {
        responseType: 'blob'
    });
    return response.data;
};
