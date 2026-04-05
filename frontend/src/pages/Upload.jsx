import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { parseJd, parseResume } from '../services/api';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Code, Loader2 } from 'lucide-react';

export default function Upload() {
    const navigate = useNavigate();
    const { setJdText, setResumeData, githubUrl, setGithubUrl } = useResume();
    
    const [jdFile, setJdFile] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleProcess = async () => {
        if (!jdFile || !file) return;
        setLoading(true);
        try {
            const [jdResult, resumeResult] = await Promise.all([
                parseJd(jdFile),
                parseResume(file)
            ]);
            
            // set the actual JD text retrieved from parsing
            setJdText(jdResult.extracted_text || "");
            
            setResumeData({
                jdParsed: jdResult,
                resumeParsed: resumeResult
            });
            
            navigate('/analysis');
        } catch (error) {
            console.error(error);
            alert("Error parsing documents.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full pt-12">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Upload your materials</h2>
                    <p className="text-zinc-400 mt-2">Provide the job description, your current resume, and an optional GitHub link.</p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
                    {/* JD Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-400" />
                            Job Description File (PDF / TXT)
                        </label>
                        <div className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-800 border-dashed rounded-xl hover:bg-zinc-800/50 transition-colors">
                            <div className="space-y-1 text-center">
                                <FileText className="mx-auto h-12 w-12 text-zinc-500" />
                                <div className="flex justify-center text-sm text-zinc-400">
                                    <label className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500">
                                        <span>Upload JD File</span>
                                        <input type="file" className="sr-only" accept=".pdf,.txt,.docx" onChange={(e) => setJdFile(e.target.files[0])} />
                                    </label>
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {jdFile ? jdFile.name : "PDF, TXT, DOCX up to 5MB"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                            <UploadCloud className="w-4 h-4 text-cyan-400" />
                            Current Resume (PDF)
                        </label>
                        <div className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-800 border-dashed rounded-xl hover:bg-zinc-800/50 transition-colors">
                            <div className="space-y-1 text-center">
                                <UploadCloud className="mx-auto h-12 w-12 text-zinc-500" />
                                <div className="flex justify-center text-sm text-zinc-400">
                                    <label className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300">
                                        <span>Upload a file</span>
                                        <input type="file" className="sr-only" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                                    </label>
                                </div>
                                <p className="text-xs text-zinc-500">
                                    {file ? file.name : "PDF up to 5MB"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                            <Code className="w-4 h-4 text-emerald-400" />
                            GitHub Profile (Optional)
                        </label>
                        <input 
                            type="text"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                            placeholder="https://github.com/username"
                        />
                    </div>
                </div>

                <button 
                    onClick={handleProcess}
                    disabled={!jdFile || !file || loading}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:shadow-none"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze Gap"}
                </button>

            </motion.div>
        </div>
    );
}
