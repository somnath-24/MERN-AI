import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Map, 
  Code2, 
  GraduationCap, 
  MessageSquare, 
  BarChart3, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Send, 
  Loader2,
  AlertCircle,
  Trophy,
  Clock,
  Zap,
  Terminal,
  ArrowLeft,
  Play,
  X
} from 'lucide-react';
import axios from 'axios';
import { cn } from './lib/utils';
import { RoadmapData, Question, TeachData, ProgressData } from './types';

const USER_ID = 'demo-user-123'; // In a real app, this would come from auth

export default function App() {
  const [step, setStep] = useState<'landing' | 'loading' | 'dashboard'>('landing');
  const [focus, setFocus] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [level, setLevel] = useState<string>('intermediate');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "Reading your focus area...",
    "Building your session plan...",
    "Let's get to work..."
  ];

  useEffect(() => {
    if (step === 'loading') {
      const interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < loadingMessages.length - 1) return prev + 1;
          clearInterval(interval);
          setTimeout(() => setStep('dashboard'), 1000);
          return prev;
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleStart = (f: string, t: string) => {
    setFocus(f);
    setTime(t);
    setStep('loading');
  };

  return (
    <div className="min-h-screen bg-bg text-white selection:bg-accent-frontend selection:text-bg">
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <LandingPage onStart={handleStart} level={level} setLevel={setLevel} />
        )}
        {step === 'loading' && (
          <LoadingScreen message={loadingMessages[loadingStep]} />
        )}
        {step === 'dashboard' && (
          <Dashboard 
            focus={focus} 
            time={time} 
            level={level} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onBack={() => setStep('landing')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LandingPage({ onStart, level, setLevel }: { onStart: (f: string, t: string) => void, level: string, setLevel: (l: string) => void }) {
  const [focus, setFocus] = useState('');
  const [time, setTime] = useState('');

  const focuses = [
    { id: 'Frontend JS', icon: <Zap className="text-accent-frontend" /> },
    { id: 'Node.js & Backend', icon: <Terminal className="text-accent-backend" /> },
    { id: 'Both', icon: <LayoutDashboard className="text-purple-400" /> },
    { id: 'Random', icon: <Zap className="text-orange-400" /> }
  ];

  const times = ['30 mins', '1 hour', 'Deep dive'];
  const levels = ['basics', 'intermediate', 'advanced'];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center"
    >
      <motion.h1 
        initial={{ y: 20 }} 
        animate={{ y: 0 }}
        className="text-6xl md:text-8xl clash-display mb-6 bg-gradient-to-r from-accent-frontend to-accent-backend bg-clip-text text-transparent"
      >
        MERN-AI
      </motion.h1>
      <p className="text-xl text-gray-400 mb-12 max-w-2xl">
        Level up your full-stack JavaScript skills with AI-powered roadmaps, 
        real-world practice, and interactive teaching.
      </p>

      <div className="w-full space-y-12 text-left">
        <section>
          <h2 className="text-2xl clash-display mb-6 flex items-center gap-2">
            <span className="text-accent-frontend">01.</span> What's your level?
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {levels.map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all capitalize",
                  level === l ? "border-accent-frontend bg-accent-frontend/10 text-accent-frontend" : "border-white/10 hover:border-white/20 bg-white/5"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl clash-display mb-6 flex items-center gap-2">
            <span className="text-accent-frontend">02.</span> What do you want to focus on today?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {focuses.map(f => (
              <button
                key={f.id}
                onClick={() => setFocus(f.id)}
                className={cn(
                  "flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left",
                  focus === f.id ? "border-accent-frontend bg-accent-frontend/10" : "border-white/10 hover:border-white/20 bg-white/5"
                )}
              >
                <div className="p-3 bg-white/5 rounded-xl">{f.icon}</div>
                <span className="text-lg font-medium">{f.id}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl clash-display mb-6 flex items-center gap-2">
            <span className="text-accent-frontend">03.</span> How much time do you have?
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {times.map(t => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={cn(
                  "p-4 rounded-2xl border-2 transition-all",
                  time === t ? "border-accent-frontend bg-accent-frontend/10 text-accent-frontend" : "border-white/10 hover:border-white/20 bg-white/5"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <button
          disabled={!focus || !time}
          onClick={() => onStart(focus, time)}
          className="w-full py-6 rounded-2xl bg-white text-bg clash-display text-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          Let's Go
        </button>
      </div>
    </motion.div>
  );
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-bg"
    >
      <div className="relative w-24 h-24 mb-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-accent-frontend border-t-transparent rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 border-4 border-accent-backend border-b-transparent rounded-full"
        />
      </div>
      <motion.p 
        key={message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl clash-display text-gray-400"
      >
        {message}
      </motion.p>
    </motion.div>
  );
}

function Dashboard({ focus, time, level, activeTab, setActiveTab, onBack }: { focus: string, time: string, level: string, activeTab: number, setActiveTab: (n: number) => void, onBack: () => void }) {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const [roadmapRes, progressRes] = await Promise.all([
          axios.post('/api/ai/roadmap', { focus, level, userId: USER_ID }),
          axios.get(`/api/progress/${USER_ID}`)
        ]);
        setRoadmap(roadmapRes.data);
        setProgress(progressRes.data);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.error || "Failed to load dashboard. Please check your API keys.");
      }
    };
    fetchData();
  }, [focus, level]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-md">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl clash-display mb-4">Setup Required</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="text-left bg-black/20 p-4 rounded-xl text-sm font-mono mb-6">
            <p className="text-accent-frontend mb-2">Required Secrets:</p>
            <ul className="space-y-1">
              <li>• GROQ_API_KEY</li>
              <li>• MONGO_URI</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-white text-bg font-bold rounded-xl"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { name: 'Roadmap', icon: <Map size={20} /> },
    { name: 'Practice', icon: <Code2 size={20} /> },
    { name: 'Teach Me', icon: <GraduationCap size={20} /> },
    { name: 'Ask Doubt', icon: <MessageSquare size={20} /> },
    { name: 'Progress', icon: <BarChart3 size={20} /> },
  ];

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    setActiveTab(2); // Switch to Teach Me
  };

  const allTopics = roadmap ? [...(roadmap.frontend || []), ...(roadmap.backend || [])].map(t => t.title) : [];

  return (
    <div className="flex h-screen overflow-hidden bg-bg text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl clash-display text-accent-frontend">MERN-AI</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{level} mode</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {tabs.map((tab, idx) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(idx)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                activeTab === idx ? "bg-accent-frontend text-bg font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Daily Goal</span>
              <span className="text-xs font-bold text-accent-frontend">60%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent-frontend w-[60%]" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 min-h-0 custom-scrollbar relative">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
              title="Go Back"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h2 className="text-4xl clash-display">{tabs[activeTab].name}</h2>
              <p className="text-gray-400">Focusing on {focus} • {time} session</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Trophy className="text-yellow-400" size={18} />
              <span className="font-bold">{progress?.scores.length || 0} XP</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div 
              key="roadmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RoadmapTab 
                roadmap={roadmap} 
                progress={progress} 
                onTopicClick={handleTopicClick} 
              />
            </motion.div>
          )}
          {activeTab === 1 && (
            <motion.div 
              key="practice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PracticeTab roadmap={roadmap} level={level} />
            </motion.div>
          )}
          {activeTab === 2 && (
            <motion.div 
              key="teach"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TeachTab 
                topic={selectedTopic || (roadmap?.frontend?.[0]?.title || 'DOM')} 
                level={level} 
                allTopics={allTopics}
                onTopicClick={handleTopicClick}
              />
            </motion.div>
          )}
          {activeTab === 3 && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ChatTab level={level} />
            </motion.div>
          )}
          {activeTab === 4 && (
            <motion.div 
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProgressTab progress={progress} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function RoadmapTab({ roadmap, progress, onTopicClick }: { roadmap: RoadmapData | null, progress: ProgressData | null, onTopicClick: (t: string) => void }) {
  if (!roadmap) return <LoadingIndicator />;

  const isCompleted = (topic: string) => progress?.completedTopics.includes(topic);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <div className="space-y-6">
        <h3 className="text-2xl clash-display flex items-center gap-3">
          <Zap className="text-accent-frontend" /> Frontend Track
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {roadmap.frontend?.map(topic => (
            <button
              key={topic.title}
              onClick={() => onTopicClick(topic.title)}
              className={cn(
                "flex items-center justify-between p-5 rounded-2xl border transition-all text-left group",
                isCompleted(topic.title) ? "bg-accent-frontend/10 border-accent-frontend/30" : "bg-white/5 border-white/10 hover:border-white/30"
              )}
            >
              <span className={cn("text-lg", isCompleted(topic.title) ? "text-accent-frontend font-medium" : "text-gray-300")}>
                {topic.title}
              </span>
              {isCompleted(topic.title) ? (
                <CheckCircle2 className="text-accent-frontend" size={20} />
              ) : (
                <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" size={20} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl clash-display flex items-center gap-3">
          <Terminal className="text-accent-backend" /> Backend Track
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {roadmap.backend?.map(topic => (
            <button
              key={topic.title}
              onClick={() => onTopicClick(topic.title)}
              className={cn(
                "flex items-center justify-between p-5 rounded-2xl border transition-all text-left group",
                isCompleted(topic.title) ? "bg-accent-backend/10 border-accent-backend/30" : "bg-white/5 border-white/10 hover:border-white/30"
              )}
            >
              <span className={cn("text-lg", isCompleted(topic.title) ? "text-accent-backend font-medium" : "text-gray-300")}>
                {topic.title}
              </span>
              {isCompleted(topic.title) ? (
                <CheckCircle2 className="text-accent-backend" size={20} />
              ) : (
                <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" size={20} />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PracticeTab({ roadmap, level }: { roadmap: RoadmapData | null, level: string }) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState(level === 'basics' ? 'Easy' : level === 'advanced' ? 'Hard' : 'Medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const fetchQuestions = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/practice', { topic, difficulty });
      setQuestions(res.data.questions);
      setCurrentIndex(0);
      setScore(0);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    if (answer === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } else {
      // Save progress
      await axios.post('/api/progress', {
        userId: USER_ID,
        topic,
        score,
        total: questions.length,
        difficulty
      });
      setQuestions([]);
    }
  };

  if (loading) return <LoadingIndicator />;

  if (questions.length > 0) {
    const q = questions[currentIndex];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-gray-400">Question {currentIndex + 1} of {questions.length}</span>
          <span className="bg-white/10 px-3 py-1 rounded-full text-sm">{difficulty}</span>
        </div>

        <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
          <h4 className="text-2xl font-medium mb-6">{q.question}</h4>
          
          {q.code && (
            <pre className="bg-bg p-6 rounded-xl overflow-x-auto mb-6 border border-white/5 font-mono text-sm">
              <code>{q.code}</code>
            </pre>
          )}

          <div className="grid grid-cols-1 gap-3">
            {q.options?.map(opt => (
              <button
                key={opt}
                disabled={showExplanation}
                onClick={() => handleAnswer(opt)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all",
                  showExplanation 
                    ? opt === q.correctAnswer 
                      ? "border-green-500 bg-green-500/10" 
                      : opt === selectedAnswer ? "border-red-500 bg-red-500/10" : "border-white/5"
                    : "border-white/10 hover:border-white/30 bg-white/5"
                )}
              >
                {opt}
              </button>
            ))}
            {q.type !== 'mcq' && !showExplanation && (
              <div className="space-y-4">
                <textarea 
                  className="w-full bg-bg border border-white/10 rounded-xl p-4 min-h-[100px] focus:border-accent-frontend outline-none"
                  placeholder="Type your answer or fix the code..."
                />
                <button 
                  onClick={() => handleAnswer('submitted')}
                  className="w-full py-4 bg-accent-frontend text-bg font-bold rounded-xl"
                >
                  Submit Answer
                </button>
              </div>
            )}
          </div>

          {showExplanation && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <div className={cn("p-2 rounded-lg", selectedAnswer === q.correctAnswer ? "bg-green-500/20" : "bg-red-500/20")}>
                  {selectedAnswer === q.correctAnswer ? <CheckCircle2 className="text-green-500" /> : <AlertCircle className="text-red-500" />}
                </div>
                <div>
                  <h5 className="font-bold text-lg mb-1">{selectedAnswer === q.correctAnswer ? 'Correct!' : 'Not quite...'}</h5>
                  <p className="text-gray-400">{q.explanation}</p>
                </div>
              </div>
              <div className="bg-accent-frontend/5 p-4 rounded-xl border border-accent-frontend/20 mb-6">
                <h6 className="text-accent-frontend font-bold text-sm uppercase mb-1">Real-World Use Case</h6>
                <p className="text-sm text-gray-300">{q.realWorldUseCase}</p>
              </div>
              <button 
                onClick={nextQuestion}
                className="w-full py-4 bg-white text-bg font-bold rounded-xl flex items-center justify-center gap-2"
              >
                {currentIndex === questions.length - 1 ? 'Finish Practice' : 'Next Question'} <ChevronRight size={20} />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
        <h3 className="text-2xl clash-display mb-8">Start a Practice Session</h3>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-400 block mb-2">Select Topic</label>
            <select 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-bg border border-white/10 rounded-xl p-4 outline-none focus:border-accent-frontend"
            >
              <option value="">Choose a topic...</option>
              {roadmap?.frontend?.map(t => <option key={t.title} value={t.title}>{t.title} (Frontend)</option>)}
              {roadmap?.backend?.map(t => <option key={t.title} value={t.title}>{t.title} (Backend)</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">Difficulty</label>
            <div className="grid grid-cols-3 gap-3">
              {['Easy', 'Medium', 'Hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all",
                    difficulty === d ? "border-accent-frontend bg-accent-frontend/10 text-accent-frontend" : "border-white/10 bg-white/5"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={!topic}
            onClick={fetchQuestions}
            className="w-full py-4 bg-accent-frontend text-bg font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            Generate Questions
          </button>
        </div>
      </div>
    </div>
  );
}

function TeachTab({ topic, level, allTopics, onTopicClick }: { topic: string, level: string, allTopics: string[], onTopicClick: (t: string) => void }) {
  const [data, setData] = useState<TeachData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState<{ code: string, title: string } | null>(null);
  const lastFetchedTopic = useRef<string | null>(null);

  const currentIndex = allTopics.indexOf(topic);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  useEffect(() => {
    let isCancelled = false;

    const fetchTeach = async () => {
      if (!topic) return;
      if (topic === lastFetchedTopic.current && data) return;
      
      console.log(`Fetching teaching content for: ${topic} (${level})`);
      lastFetchedTopic.current = topic;
      setLoading(true);
      setError(null);
      
      try {
        const res = await axios.post('/api/ai/teach', { topic, level });
        if (!isCancelled) {
          if (res.data && res.data.explanation) {
            setData(res.data);
          } else {
            throw new Error("Invalid data received from AI");
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error("Fetch Teach Error:", err);
          setError(err.response?.data?.error || err.message || "Failed to load teaching content.");
          // Reset lastFetchedTopic on error so user can retry
          lastFetchedTopic.current = null;
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchTeach();

    return () => {
      isCancelled = true;
    };
  }, [topic]);

  if (loading && !data) return <LoadingIndicator />;
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-400 mb-6">{error}</p>
        <button 
          onClick={() => {
            lastFetchedTopic.current = null;
            window.location.reload();
          }}
          className="px-6 py-2 bg-white text-bg rounded-xl font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
      <GraduationCap size={48} className="mb-4 opacity-20" />
      <p className="text-xl clash-display">Select a topic to start learning!</p>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-20 relative">
      {/* Sub-navigation Sidebar (W3Schools style) */}
      <aside className="w-full lg:w-64 shrink-0 space-y-4 hidden lg:block">
        <div className="sticky top-8">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-4">Course Content</h4>
          <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-2">
            {allTopics.map((t, idx) => (
              <button
                key={t}
                onClick={() => onTopicClick(t)}
                className={cn(
                  "w-full text-left px-4 py-2 rounded-lg text-sm transition-all",
                  topic === t 
                    ? "bg-accent-frontend text-bg font-bold shadow-lg shadow-accent-frontend/20" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="opacity-50 mr-2">{String(idx + 1).padStart(2, '0')}</span> {t}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <motion.div 
        key={topic}
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="flex-1 space-y-12 relative"
      >
        {loading && (
        <div className="absolute inset-0 bg-bg/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl min-h-[400px]">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-accent-frontend border-t-transparent rounded-full mb-4"
            />
            <p className="text-white font-bold">Updating lesson...</p>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <button 
            disabled={!prevTopic}
            onClick={() => prevTopic && onTopicClick(prevTopic)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all disabled:opacity-30"
          >
            <ArrowLeft size={16} /> Previous
          </button>
          <button 
            disabled={!nextTopic}
            onClick={() => nextTopic && onTopicClick(nextTopic)}
            className="flex items-center gap-2 px-4 py-2 bg-accent-frontend text-bg font-bold rounded-lg transition-all disabled:opacity-30"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
        <div className="hidden md:block text-sm text-gray-500 font-mono">
          Topic {currentIndex + 1} of {allTopics.length}
        </div>
      </div>

      <section>
        <h3 className="text-4xl md:text-5xl clash-display mb-8 text-accent-frontend">{topic}</h3>
        <div className="prose prose-invert max-w-none text-gray-300 text-xl leading-relaxed bg-white/5 p-8 rounded-3xl border border-white/10">
          {data.explanation}
        </div>
      </section>

      <div className="space-y-12">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-2xl clash-display flex items-center gap-2">
              <Zap size={24} className="text-accent-frontend" /> Example: Frontend
            </h4>
            <button 
              onClick={() => setShowEditor({ code: data.codeSnippets.frontend, title: 'Frontend Editor' })}
              className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
            >
              Try it Yourself <Play size={14} />
            </button>
          </div>
          <div className="bg-[#1e1e2e] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="text-xs text-gray-500 ml-2 font-mono">App.tsx</span>
            </div>
            <pre className="p-6 font-mono text-sm overflow-x-auto text-accent-frontend/90">
              <code>{data.codeSnippets?.frontend || '// No frontend code available'}</code>
            </pre>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-2xl clash-display flex items-center gap-2">
              <Terminal size={24} className="text-accent-backend" /> Example: Backend
            </h4>
            <button 
              onClick={() => setShowEditor({ code: data.codeSnippets.backend, title: 'Backend Editor' })}
              className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
            >
              Try it Yourself <Play size={14} />
            </button>
          </div>
          <div className="bg-[#1e1e2e] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="text-xs text-gray-500 ml-2 font-mono">server.ts</span>
            </div>
            <pre className="p-6 font-mono text-sm overflow-x-auto text-accent-backend/90">
              <code>{data.codeSnippets?.backend || '// No backend code available'}</code>
            </pre>
          </div>
        </section>
      </div>

      <section className="bg-accent-frontend/5 p-10 rounded-[2.5rem] border border-accent-frontend/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <LayoutDashboard size={120} />
        </div>
        <h4 className="text-2xl clash-display mb-6 flex items-center gap-3">
          <LayoutDashboard size={24} className="text-accent-frontend" /> Real-World Mini Project
        </h4>
        <div className="bg-bg/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 font-mono text-sm mb-6 shadow-inner">
          <code>{data.miniProject || '// No project snippet available'}</code>
        </div>
        <p className="text-gray-400 text-sm italic">Tip: Copy this code and try to implement it in your local environment!</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-red-500/5 p-8 rounded-3xl border border-red-500/20">
          <h4 className="text-2xl clash-display mb-6 text-red-500 flex items-center gap-2">
            <AlertCircle size={24} /> Common Pitfalls
          </h4>
          <ul className="space-y-4">
            {data.commonMistakes?.map((m, i) => (
              <li key={i} className="flex items-start gap-4 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  !
                </div>
                <span>{m}</span>
              </li>
            )) || <li className="text-gray-500 italic">No common mistakes listed.</li>}
          </ul>
        </section>
        <section className="bg-green-500/5 p-8 rounded-3xl border border-green-500/20">
          <h4 className="text-2xl clash-display mb-6 text-green-500 flex items-center gap-2">
            <CheckCircle2 size={24} /> Test Your Knowledge
          </h4>
          <ul className="space-y-4">
            {data.exercises?.map((e, i) => (
              <li key={i} className="flex items-start gap-4 text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span>{e}</span>
              </li>
            )) || <li className="text-gray-500 italic">No exercises available.</li>}
          </ul>
        </section>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between border-t border-white/10 pt-10 mt-20">
        <button 
          disabled={!prevTopic}
          onClick={() => prevTopic && onTopicClick(prevTopic)}
          className="flex flex-col items-start gap-1 group disabled:opacity-30"
        >
          <span className="text-xs text-gray-500 uppercase tracking-widest">Previous Topic</span>
          <span className="text-lg font-bold flex items-center gap-2 group-hover:text-accent-frontend transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> {prevTopic || 'None'}
          </span>
        </button>
        <button 
          disabled={!nextTopic}
          onClick={() => nextTopic && onTopicClick(nextTopic)}
          className="flex flex-col items-end gap-1 group disabled:opacity-30 text-right"
        >
          <span className="text-xs text-gray-500 uppercase tracking-widest">Next Topic</span>
          <span className="text-lg font-bold flex items-center gap-2 group-hover:text-accent-frontend transition-colors">
            {nextTopic || 'End of Track'} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>

      {/* Try it Yourself Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-bg/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-6xl h-[80vh] bg-[#1e1e2e] rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Play size={20} className="text-green-500" />
                  </div>
                  <h3 className="text-xl clash-display">{showEditor.title}</h3>
                </div>
                <button 
                  onClick={() => setShowEditor(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
                <div className="border-r border-white/10 flex flex-col">
                  <div className="px-6 py-3 bg-white/5 text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10">
                    Input Code
                  </div>
                  <textarea 
                    defaultValue={showEditor.code}
                    className="flex-1 p-8 bg-transparent font-mono text-sm outline-none resize-none text-accent-frontend/90"
                    placeholder="Edit code here..."
                  />
                </div>
                <div className="flex flex-col bg-white/[0.02]">
                  <div className="px-6 py-3 bg-white/5 text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10">
                    Result Preview
                  </div>
                  <div className="flex-1 p-8 font-mono text-sm text-gray-400 overflow-y-auto">
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5 mb-4">
                      <span className="text-green-500">✓</span> Code is valid and ready to run.
                    </div>
                    <p className="mb-4">// This is a simulated environment.</p>
                    <p className="mb-4">// In a real MERN setup, this code would interact with your database and frontend components.</p>
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <h5 className="text-white font-bold mb-4">Expected Output:</h5>
                      <div className="p-6 bg-bg rounded-xl border border-white/5 text-xs">
                        {showEditor.title.includes('Backend') ? (
                          <pre>{`{
  "status": "success",
  "message": "Data processed successfully",
  "timestamp": "${new Date().toISOString()}"
}`}</pre>
                        ) : (
                          <div className="space-y-2">
                            <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                            <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                            <div className="h-10 w-full bg-accent-frontend/20 rounded mt-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end gap-4">
                <button 
                  onClick={() => setShowEditor(null)}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button className="px-8 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all flex items-center gap-2">
                  Run Code <Play size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </div>
  );
}

function ChatTab({ level }: { level: string }) {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', { messages: newMessages, level });
      setMessages([...newMessages, res.data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-250px)] flex flex-col">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p className="text-xl clash-display">Ask me anything about JavaScript!</p>
            <p className="text-sm max-w-xs mt-2">I can help with debugging, concept explanations, or comparing Browser vs Node.js.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl",
              m.role === 'user' ? "bg-accent-frontend text-bg font-medium" : "bg-white/5 border border-white/10 text-gray-200"
            )}>
              <pre className="whitespace-pre-wrap font-sans">
                {m.content}
              </pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-2">
              <Loader2 className="animate-spin text-accent-frontend" size={18} />
              <span className="text-sm text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a doubt or paste code to debug..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pr-16 outline-none focus:border-accent-frontend transition-all"
        />
        <button 
          onClick={handleSend}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-accent-frontend text-bg rounded-xl hover:scale-105 active:scale-95 transition-all"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

function ProgressTab({ progress }: { progress: ProgressData | null }) {
  if (!progress) return <LoadingIndicator />;

  const stats = [
    { label: 'Topics Completed', value: progress.completedTopics.length, icon: <CheckCircle2 className="text-green-400" /> },
    { label: 'Total Attempted', value: progress.totalAttempted, icon: <Code2 className="text-blue-400" /> },
    { label: 'Overall Accuracy', value: `${Math.round(progress.accuracy)}%`, icon: <BarChart3 className="text-accent-frontend" /> },
    { label: 'Sessions', value: progress.scores.length, icon: <Clock className="text-purple-400" /> },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/5 rounded-lg">{s.icon}</div>
              <span className="text-sm text-gray-400">{s.label}</span>
            </div>
            <div className="text-3xl clash-display">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
          <h3 className="text-2xl clash-display mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {progress.scores.slice().reverse().map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <div className="font-bold">{s.topic}</div>
                  <div className="text-xs text-gray-500">{s.difficulty} • {new Date(s.date).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-accent-frontend font-bold">{s.score}/{s.total}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest">Score</div>
                </div>
              </div>
            ))}
            {progress.scores.length === 0 && <p className="text-center text-gray-500 py-8">No activity yet. Start practicing!</p>}
          </div>
        </section>

        <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
          <h3 className="text-2xl clash-display mb-6">Learning Insights</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Frontend Mastery</span>
                <span className="text-sm font-bold">45%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent-frontend w-[45%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Backend Mastery</span>
                <span className="text-sm font-bold">30%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent-backend w-[30%]" />
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-accent-frontend/10 rounded-2xl border border-accent-frontend/20">
              <h4 className="text-accent-frontend font-bold mb-2 flex items-center gap-2">
                <Zap size={18} /> Mentor Recommendation
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                You're doing great with DOM manipulation! Based on your recent scores, 
                I recommend focusing on <strong>Async/Await</strong> and <strong>Express Middleware</strong> next to strengthen your full-stack flow.
              </p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-accent-frontend" size={48} />
    </div>
  );
}
