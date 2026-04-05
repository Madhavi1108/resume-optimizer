import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { generateResume, exportPdf, exportDocx } from '../services/api';
import { motion } from 'framer-motion';
import { Loader2, Download, FileCheck, RefreshCw, FileText } from 'lucide-react';

export default function Preview() {
    const navigate = useNavigate();
    const { 
        jdText, resumeData, userAnswers, selectedProjects,
        generatedResume, setGeneratedResume, gapAnalysis, setGapAnalysis, setGithubUrl, setJdText
    } = useResume();
    
    const [loading, setLoading] = useState(!generatedResume);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (!resumeData) {
            navigate('/upload');
            return;
        }

        if (!generatedResume) {
            const createResume = async () => {
                try {
                    const jd = jdText || JSON.stringify(resumeData.jdParsed);
                    const res = await generateResume(
                        jd,
                        resumeData.resumeParsed,
                        userAnswers,
                        selectedProjects
                    );
                    setGeneratedResume(res.resume_text);
                } catch (err) {
                    console.error(err);
                    setGeneratedResume("Failed to generate resume. Please check the backend or your API keys.");
                } finally {
                    setLoading(false);
                }
            };

            createResume();
        }
    }, [resumeData, generatedResume, jdText, userAnswers, selectedProjects, navigate, setGeneratedResume]);

    const handleDownload = async () => {
        if (!generatedResume) return;
        setDownloading(true);
        try {
            const blob = await exportPdf(generatedResume);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `Optimized_Resume_${gapAnalysis?.match_percentage || 100}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error(err);
            alert("Error downloading PDF");
        } finally {
            setDownloading(false);
        }
    };

    const handleDownloadDocx = async () => {
        if (!generatedResume) return;
        setDownloading(true);
        try {
            const blob = await exportDocx(generatedResume);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `Optimized_Resume_${gapAnalysis?.match_percentage || 100}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error(err);
            alert("Error downloading DOCX");
        } finally {
            setDownloading(false);
        }
    };

    const handleRestart = () => {
        setGeneratedResume('');
        setGapAnalysis(null);
        setJdText('');
        setGithubUrl('');
        navigate('/');
    };

    if (loading) {
        return <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
            <p className="text-zinc-400 max-w-sm text-center">
                Applying ATS optimizations, bridging skill gaps, and assembling your bespoke resume...
            </p>
        </div>;
    }

    return (
        <div className="max-w-5xl mx-auto w-full pt-8 pb-12 flex flex-col items-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-8">
                
                <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur">
                    <div className="flex items-center gap-4 text-emerald-400 mb-4 sm:mb-0">
                        <FileCheck className="w-8 h-8" />
                        <div>
                            <h2 className="text-xl font-bold text-white">Your Optimized Resume is Ready!</h2>
                            <p className="text-sm text-emerald-500/80">Tailored to bypass ATS systems effortlessly.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={handleRestart}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span>Start Over</span>
                        </button>
                        <button 
                            onClick={handleDownloadDocx}
                            disabled={downloading}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-800 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                        >
                            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                            <span>DOCX</span>
                        </button>
                        <button 
                            onClick={handleDownload}
                            disabled={downloading}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                        >
                            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            <span>PDF</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-2xl p-8 sm:p-12 text-black font-serif overflow-y-auto max-h-[800px] border border-zinc-800 custom-scrollbar mt-6 mx-auto w-full max-w-[850px]">
                    <pre className="whitespace-pre-wrap font-serif text-[15px] leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                        {generatedResume}
                    </pre>
                </div>
                
            </motion.div>
        </div>
    );
}
