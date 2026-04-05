import { createContext, useState, useContext } from 'react';

const ResumeContext = createContext();

export const useResume = () => useContext(ResumeContext);

export const ResumeProvider = ({ children }) => {
    const [jdText, setJdText] = useState('');
    const [resumeData, setResumeData] = useState(null);
    const [githubUrl, setGithubUrl] = useState('');
    const [gapAnalysis, setGapAnalysis] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [githubProjects, setGithubProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [generatedResume, setGeneratedResume] = useState('');

    return (
        <ResumeContext.Provider value={{
            jdText, setJdText,
            resumeData, setResumeData,
            githubUrl, setGithubUrl,
            gapAnalysis, setGapAnalysis,
            questions, setQuestions,
            userAnswers, setUserAnswers,
            githubProjects, setGithubProjects,
            selectedProjects, setSelectedProjects,
            generatedResume, setGeneratedResume
        }}>
            {children}
        </ResumeContext.Provider>
    );
};
