import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { generateQuestions } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ArrowRight, Loader2, Check } from 'lucide-react';

export default function Questions() {
    const navigate = useNavigate();
    const { gapAnalysis, resumeData, setUserAnswers } = useResume();
    const [localQuestions, setLocalQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answerInput, setAnswerInput] = useState('');
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        if (!gapAnalysis) {
            navigate('/upload');
            return;
        }

        const fetchQs = async () => {
            try {
                const missing = gapAnalysis.missing_skills.concat(gapAnalysis.keyword_gaps).slice(0, 5);
                if(missing.length === 0) {
                    setLocalQuestions(["You seem to have a perfect match! Any additional projects or experiences you'd like to highlight?"]);
                } else {
                    const res = await generateQuestions(missing, resumeData.jdParsed.experience_level || "Mid-level");
                    setLocalQuestions(res.questions);
                }
            } catch (err) {
                console.error(err);
                setLocalQuestions(["Describe any experience you have related to the missing skills."]);
            } finally {
                setLoading(false);
            }
        };

        fetchQs();
    }, [gapAnalysis, resumeData, navigate]);

    const handleNext = () => {
        const currentQ = localQuestions[currentIndex];
        const newAnswers = { ...answers, [currentQ]: answerInput };
        setAnswers(newAnswers);
        
        if (currentIndex < localQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setAnswerInput('');
        } else {
            setUserAnswers(newAnswers);
            navigate('/github');
        }
    };

    if (loading) {
        return <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>;
    }

    return (
        <div className="max-w-2xl mx-auto w-full pt-12 flex flex-col min-h-[500px]">
            <div className="mb-8">
                <div className="flex items-center gap-3 text-indigo-400 mb-2">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-semibold tracking-wide uppercase text-sm">Experience Interview</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Let's turn your gaps into strengths</h2>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-6 overflow-hidden">
                    <div 
                        className="bg-indigo-500 h-full transition-all duration-300"
                        style={{ width: `${((currentIndex) / localQuestions.length) * 100}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col"
                >
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex-1 flex flex-col">
                        <p className="text-xl text-zinc-100 font-medium mb-6 leading-relaxed">
                            {localQuestions[currentIndex]}
                        </p>
                        
                        <textarea
                            autoFocus
                            value={answerInput}
                            onChange={(e) => setAnswerInput(e.target.value)}
                            className="flex-1 min-h-[150px] bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                            placeholder="Type your response here..."
                        />
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-end">
                <button 
                    onClick={handleNext}
                    disabled={!answerInput.trim()}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                    <span>{currentIndex === localQuestions.length - 1 ? "Finish" : "Next Question"}</span>
                    {currentIndex === localQuestions.length - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
