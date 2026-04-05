import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { analyzeGithub } from '../services/api';
import { motion } from 'framer-motion';
import { Code, Star, CheckCircle2, Circle, Loader2, ArrowRight } from 'lucide-react';

export default function GitHubSelection() {
    const navigate = useNavigate();
    const { githubUrl, resumeData, jdText, setGithubProjects, setSelectedProjects } = useResume();
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(new Set());

    useEffect(() => {
        if (!githubUrl) {
            navigate('/preview');
            return;
        }

        const fetchRepos = async () => {
            try {
                const jd = jdText || (resumeData?.jdParsed ? JSON.stringify(resumeData.jdParsed) : "General Software Engineer");
                const result = await analyzeGithub(githubUrl, jd);
                setRepos(result);
                setGithubProjects(result);
                
                const topIds = new Set(result.slice(0, 3).map(r => r.name));
                setSelected(topIds);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, [githubUrl, navigate, jdText, resumeData, setGithubProjects]);

    const toggleSelect = (name) => {
        const newSet = new Set(selected);
        if (newSet.has(name)) newSet.delete(name);
        else newSet.add(name);
        setSelected(newSet);
    };

    const handleContinue = () => {
        const selectedRepos = repos.filter(r => selected.has(r.name));
        setSelectedProjects(selectedRepos);
        navigate('/preview');
    };

    if (loading) {
        return <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <Code className="w-12 h-12 text-emerald-500 opacity-50" />
                <p className="text-zinc-400">Analyzing your GitHub footprint...</p>
            </div>
        </div>;
    }

    if (repos.length === 0) {
        setTimeout(() => navigate('/preview'), 0);
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto w-full pt-12">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Recommended Projects</h2>
                    <p className="text-zinc-400 mt-2">We found these repositories from your profile that match the job description well.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repos.map((repo, idx) => {
                        const isSelected = selected.has(repo.name);
                        return (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                key={repo.name} 
                                onClick={() => toggleSelect(repo.name)}
                                className={`cursor-pointer bg-zinc-900/50 border rounded-2xl p-6 transition-all relative overflow-hidden ${isSelected ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}
                            >
                                {isSelected && (
                                    <div className="absolute top-4 right-4 text-emerald-400">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                )}
                                {!isSelected && (
                                    <div className="absolute top-4 right-4 text-zinc-600">
                                        <Circle className="w-5 h-5" />
                                    </div>
                                )}

                                <h3 className="font-semibold text-lg text-white mb-2 pr-6 truncate">{repo.name}</h3>
                                <p className="text-sm text-zinc-400 mb-4 line-clamp-3 min-h-[60px]">{repo.description || "No description provided."}</p>
                                
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <div className="flex gap-2 text-zinc-300">
                                        {repo.languages?.slice(0, 2).map(lang => (
                                            <span key={lang} className="px-2 py-1 bg-zinc-800 rounded-md">{lang}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span>{repo.stars}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-zinc-800/50">
                                    <p className="text-xs text-emerald-400 line-clamp-2"><strong>AI Note:</strong> {repo.reason}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        onClick={handleContinue}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                    >
                        <span>Generate Resume</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
