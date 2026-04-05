import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Sparkles, Code } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-Powered Optimization</span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                    Land your dream job with an <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">ATS-killer</span> resume.
                </h1>
                <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
                    We analyze the job description, find your skill gaps, augment your experience using your GitHub, and generate a bespoke PDF tailored to get you hired.
                </p>
                
                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => navigate('/upload')}
                        className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-zinc-950 rounded-xl font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        <span>Start Optimizing</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full"
            >
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur">
                    <FileText className="w-8 h-8 text-indigo-400 mb-4" />
                    <h3 className="text-lg font-semibold text-zinc-100 mb-2">Smart Parsing</h3>
                    <p className="text-sm text-zinc-400">Extracts crucial data from your PDF using AI to understand your career.</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur">
                    <Sparkles className="w-8 h-8 text-cyan-400 mb-4" />
                    <h3 className="text-lg font-semibold text-zinc-100 mb-2">Gap Analysis</h3>
                    <p className="text-sm text-zinc-400">Finds missing keywords against the JD so you never fail the ATS screen.</p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur">
                    <Code className="w-8 h-8 text-emerald-400 mb-4" />
                    <h3 className="text-lg font-semibold text-zinc-100 mb-2">GitHub Sync</h3>
                    <p className="text-sm text-zinc-400">Automatically pulls and details relevant projects to strengthen your profile.</p>
                </div>
            </motion.div>
        </div>
    );
}
