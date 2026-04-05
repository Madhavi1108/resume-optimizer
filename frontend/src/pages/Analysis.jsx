import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { analyzeGap } from '../services/api';
import { motion } from 'framer-motion';
import { Target, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Analysis() {
    const navigate = useNavigate();
    const { resumeData, setGapAnalysis } = useResume();
    const [localGap, setLocalGap] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!resumeData) {
            navigate('/upload');
            return;
        }

        const fetchGap = async () => {
            try {
                const result = await analyzeGap(
                    resumeData.jdParsed.required_skills.concat(resumeData.jdParsed.preferred_skills),
                    resumeData.resumeParsed.skills,
                    resumeData.jdParsed.ats_keywords
                );
                setLocalGap(result);
                setGapAnalysis(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGap();
    }, [resumeData, navigate, setGapAnalysis]);

    if (loading) {
        return <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <Target className="w-12 h-12 text-indigo-500 opacity-50" />
                <p className="text-zinc-400">Analyzing ATS compatibility...</p>
            </div>
        </div>;
    }

    if (!localGap) return null;

    return (
        <div className="max-w-4xl mx-auto w-full pt-12">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 backdrop-blur">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Match Score</h2>
                        <p className="text-zinc-400">Based on required skills and ATS keywords</p>
                    </div>
                    <div className="flex items-center justify-center w-24 h-24 rounded-full border-4 relative" style={{ borderColor: localGap.match_percentage > 75 ? '#22c55e' : localGap.match_percentage > 50 ? '#eab308' : '#ef4444' }}>
                        <span className="text-2xl font-black">{localGap.match_percentage}%</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                            <h3 className="font-semibold text-white">Matching Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {localGap.matching_skills.map(s => (
                                <span key={s} className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-sm">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-rose-400">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-semibold text-white">Missing Skills & Keywords</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {localGap.missing_skills.concat(localGap.keyword_gaps).map(s => (
                                <span key={s} className="px-3 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/20 rounded-full text-sm">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        onClick={() => navigate('/questions')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                    >
                        <span>Fill the Gaps</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
