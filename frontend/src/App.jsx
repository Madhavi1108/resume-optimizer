import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Analysis from './pages/Analysis';
import Questions from './pages/Questions';
import GitHubSelection from './pages/GitHubSelection';
import Preview from './pages/Preview';

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-slate-50 flex flex-col font-sans selection:bg-indigo-500/30">
        <ResumeProvider>
            <Router>
                <header className="px-6 py-4 border-b border-zinc-800/80 flex justify-between items-center bg-zinc-900/50 backdrop-blur sticky top-0 z-50">
                    <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Lumina
                        </span>
                        <span className="text-zinc-400 font-medium">Resume</span>
                    </h1>
                </header>
                <main className="flex-1 flex flex-col relative w-full h-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/analysis" element={<Analysis />} />
                        <Route path="/questions" element={<Questions />} />
                        <Route path="/github" element={<GitHubSelection />} />
                        <Route path="/preview" element={<Preview />} />
                    </Routes>
                </main>
            </Router>
        </ResumeProvider>
    </div>
  );
}

export default App;
