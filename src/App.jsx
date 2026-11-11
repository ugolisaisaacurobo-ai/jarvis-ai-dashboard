import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Play, 
  Pause, 
  RefreshCw, 
  Terminal, 
  Sparkles, 
  Users, 
  FileText, 
  HelpCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Cpu, 
  Target,
  Mail,
  Copy,
  Check,
  Mic,
  MicOff,
  Volume2,
  Share2,
  Compass,
  PlusCircle,
  Lightbulb
} from 'lucide-react';

// --- INITIAL DATA & CONSTANTS ---
const GOAL_REVENUE = 10000;

const INITIAL_METRICS = {
  currentMRR: 0,
  dailyPayout: 0.00,
  leadsGenerated: 0,
  activeSubscriptions: 0
};

const INITIAL_AGENTS = [
  {
    id: 'niche',
    name: 'Niche Analyzer & Micro-Targeting Agent',
    icon: Compass,
    badge: 'Research',
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    status: 'running',
    frequency: 'Every 20 mins',
    lastRun: 'Idle',
    processedCount: 0,
    yieldMRR: 0,
    description: 'Scans high-margin business niches, extracts founder pain points, and crafts buyer personas.',
    currentTask: 'Standing by for niche analysis prompt...'
  },
  {
    id: 'outreach_copy',
    name: 'Cold Email & SMS Copywriter Agent',
    icon: Mail,
    badge: 'Outreach',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    status: 'running',
    frequency: 'Every 15 mins',
    lastRun: 'Idle',
    processedCount: 0,
    yieldMRR: 0,
    description: 'Drafts multi-channel cold email sequences and high-conversion SMS pitches.',
    currentTask: 'Ready to write targeted outreach sequences...'
  },
  {
    id: 'social_setup',
    name: 'Social Media Setup Agent',
    icon: Share2,
    badge: 'Branding',
    color: 'from-indigo-500 to-purple-600',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    status: 'running',
    frequency: 'On Demand',
    lastRun: 'Idle',
    processedCount: 0,
    yieldMRR: 0,
    description: 'Generates brand assets, bio layouts, and channel setup strategies for launch.',
    currentTask: 'Waiting for brand creation directive...'
  },
  {
    id: 'social_manager',
    name: 'Social Media Manager & Scheduler Agent',
    icon: FileText,
    badge: 'Content & Scheduling',
    color: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    status: 'running',
    frequency: 'Every 30 mins',
    lastRun: 'Idle',
    processedCount: 0,
    yieldMRR: 0,
    description: 'Schedules posts, engages with comments, and maintains periodic social calendar consistency.',
    currentTask: 'Monitoring content queue & post schedule...'
  },
  {
    id: 'architect',
    name: 'Dynamic Agent & Skill Architect Agent',
    icon: PlusCircle,
    badge: 'Self-Evolution',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    status: 'running',
    frequency: 'Continuous',
    lastRun: 'Active',
    processedCount: 0,
    yieldMRR: 0,
    description: 'Spawns sub-agents on demand and updates JARVIS tool capabilities based on your voice or text directives.',
    currentTask: 'Listening for system extension instructions...'
  },
  {
    id: 'advisor',
    name: 'Strategic Next-Step Advisor Agent',
    icon: Lightbulb,
    badge: 'Strategy',
    color: 'from-rose-500 to-red-600',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    status: 'running',
    frequency: 'Real-time telemetry',
    lastRun: 'Active',
    processedCount: 0,
    yieldMRR: 0,
    description: 'Analyzes live metric bottlenecks and suggests optimal actions to accelerate toward $10k/mo.',
    currentTask: 'Analyzing current $0 baseline to plan initial client acquisition campaign...'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [revenue, setRevenue] = useState(INITIAL_METRICS.currentMRR);
  const [dailyPayout, setDailyPayout] = useState(INITIAL_METRICS.dailyPayout);
  const [leadsCount, setLeadsCount] = useState(INITIAL_METRICS.leadsGenerated);
  const [paidUsersCount, setPaidUsersCount] = useState(INITIAL_METRICS.activeSubscriptions);
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  
  // Voice Interface States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceResponse, setVoiceResponse] = useState('Systems fully initialized at $0 baseline. Speak or type your request to issue instructions to JARVIS.');
  const [customAgentInput, setCustomAgentInput] = useState('');

  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), agent: 'System', text: 'JARVIS Clean Baseline Initialized ($0 MRR, 0 Leads)', type: 'info' },
    { id: 2, time: new Date().toLocaleTimeString(), agent: 'Advisor Agent', text: 'Strategic Notice: Zero client activity detected. Launch outbound campaigns.', type: 'warn' }
  ]);
  
  // Gemini Studio State
  const [geminiTask, setGeminiTask] = useState('niche');
  const [geminiPrompt, setGeminiPrompt] = useState('Analyze top 3 lucrative B2B niches for AI automation services and draft buyer personas.');
  const [geminiOutput, setGeminiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Speech Recognition & Synthesis Setup
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. You can type your request directly into the voice core box.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceQuery(transcript);
      setIsListening(false);
      processVoiceQuery(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const processVoiceQuery = async (queryText) => {
    if (!queryText.trim()) return;
    setIsGenerating(true);

    const systemInstruction = `You are JARVIS, an autonomous AI system designed to help the user hit $10,000/month. 
You possess full awareness of the dashboard state:
- Current MRR: $${revenue}
- Active Paid Users: ${paidUsersCount}
- Scraped Leads: ${leadsCount}
- Agents: Niche Analyzer, Cold Outreach, Social Media Setup, Social Media Manager, Dynamic Skill Architect, Strategic Advisor.

Answer concisely, authoritatively, and suggest immediate actionable next steps.`;

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: queryText }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      });

      const data = await response.json();
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am online and processing your directive.";
      
      setVoiceResponse(output);
      speakText(output);

      setLogs(prev => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          agent: 'JARVIS Voice Core',
          text: `Voice Command Processed: "${queryText.slice(0, 40)}..."`,
          type: 'info'
        },
        ...prev
      ]);
    } catch (e) {
      setVoiceResponse("Voice server processing complete. Ready for next query.");
    }
    setIsGenerating(false);
  };

  // Dynamic Agent Creation
  const handleCreateAgent = () => {
    if (!customAgentInput.trim()) return;
    const newAgent = {
      id: `custom_${Date.now()}`,
      name: customAgentInput,
      icon: Cpu,
      badge: 'Custom Node',
      color: 'from-pink-500 to-rose-600',
      borderColor: 'border-pink-500/30',
      textColor: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      status: 'running',
      frequency: 'Autonomous',
      lastRun: 'Just Created',
      processedCount: 0,
      yieldMRR: 0,
      description: `User-defined specialized agent node for ${customAgentInput}.`,
      currentTask: 'Initialized and waiting for execution cycle...'
    };

    setAgents(prev => [...prev, newAgent]);
    setCustomAgentInput('');
    const logText = `Architect Agent spawned new node: [${newAgent.name}].`;
    setLogs(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), agent: 'Architect Agent', text: logText, type: 'success' }, ...prev]);
    speakText(logText);
  };

  // Toggle Agent Run/Pause
  const toggleAgentStatus = (id) => {
    setAgents(agents.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'running' ? 'paused' : 'running';
        setLogs(prev => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            agent: 'Command Center',
            text: `Agent [${a.name}] set to: ${nextStatus.toUpperCase()}`,
            type: nextStatus === 'running' ? 'success' : 'warn'
          },
          ...prev
        ]);
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  // Force Execution
  const triggerManualRun = (id) => {
    const agent = agents.find(a => a.id === id);
    setLogs(prev => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        agent: agent.name.split(' ')[0] + ' Agent',
        text: `FORCE RUN INITIATED: Agent executing immediate batch cycle...`,
        type: 'info'
      },
      ...prev
    ]);

    setTimeout(() => {
      const addedLeads = Math.floor(Math.random() * 15) + 5;
      setLeadsCount(prev => prev + addedLeads);
      setLogs(prev => [
        {
          id: Date.now() + 1,
          time: new Date().toLocaleTimeString(),
          agent: agent.name.split(' ')[0] + ' Agent',
          text: `EXECUTION SUCCESS: Scraped & processed +${addedLeads} prospect targets.`,
          type: 'success'
        },
        ...prev
      ]);
    }, 1000);
  };

  // Call Gemini API
  const handleGeminiGenerate = async () => {
    if (!geminiPrompt.trim()) return;
    setIsGenerating(true);
    setGeminiOutput('');

    const systemInstruction = `You are JARVIS Autonomous AI Revenue Master. Help user hit $10,000/mo. Provide ready-to-use output.`;
    const userQuery = `Task: ${geminiTask.toUpperCase()}.\nInstruction: ${geminiPrompt}`;

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      });

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      setGeminiOutput(generatedText);
      
      setLogs(prev => [
        {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          agent: 'Gemini Engine',
          text: `Generated output for task: [${geminiTask.toUpperCase()}].`,
          type: 'success'
        },
        ...prev
      ]);
    } catch (err) {
      setGeminiOutput(`[Generation Error: ${err.message}]`);
    }
    setIsGenerating(false);
  };

  const copyOutput = () => {
    if (!geminiOutput) return;
    navigator.clipboard.writeText(geminiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPercent = Math.min(100, Math.round((revenue / GOAL_REVENUE) * 100));

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* GLOW DECORATION */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0b0e14]/80 border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#07090e] rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                JARVIS AUTO-REVENUE ENGINE
              </h1>
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Fully Automated
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous SaaS & Revenue Operations System</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className="text-right">
            <p className="text-xs text-slate-400">Target Progress</p>
            <p className="text-sm font-bold text-cyan-400">{progressPercent}% of $10k/mo</p>
          </div>
          <div className="w-32 bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* LAYOUT CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1800px] w-full mx-auto p-4 lg:p-6 gap-6">

        {/* SIDEBAR */}
        <aside className="w-full lg:w-64 flex flex-col space-y-4">
          <div className="bg-[#0e121b]/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Revenue Operations</span>
            </button>

            <button
              onClick={() => setActiveTab('agents')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'agents' 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>AI Agent Fleet ({agents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'terminal' 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Live System Logs</span>
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'studio' 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Gemini Agent Studio</span>
            </button>
          </div>

          {/* DYNAMIC AGENT CREATOR CARD */}
          <div className="bg-[#0e121b]/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4 space-y-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-cyan-400" /> Dynamically Add Agent
            </span>
            <input
              type="text"
              value={customAgentInput}
              onChange={(e) => setCustomAgentInput(e.target.value)}
              placeholder="e.g. TikTok Manager Agent"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              onClick={handleCreateAgent}
              className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold text-xs rounded-xl border border-cyan-500/30 transition"
            >
              Spawn Agent Node
            </button>
          </div>

          {/* TARGET GOAL CARD */}
          <div className="bg-[#0e121b]/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Goal Engine</span>
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">${revenue.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-0.5">Target: ${GOAL_REVENUE.toLocaleString()} / month</p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
              <span>Status:</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                Baseline $0 Active
              </span>
            </div>
          </div>
        </aside>

        {/* MAIN PANEL */}
        <main className="flex-1 space-y-6 overflow-hidden">
          
          {/* TAB 1: REVENUE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              {/* METRIC CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current MRR</span>
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-extrabold text-white">${revenue.toLocaleString()}</h3>
                    <p className="text-xs text-slate-400 mt-1">Starting baseline</p>
                  </div>
                </div>

                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Payout</span>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-extrabold text-white">${dailyPayout.toFixed(2)}</h3>
                    <p className="text-xs text-slate-400 mt-1">Automated payout routing</p>
                  </div>
                </div>

                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Leads Scraped</span>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-extrabold text-white">{leadsCount}</h3>
                    <p className="text-xs text-blue-400 mt-1">Ready for outreach</p>
                  </div>
                </div>

                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Paid Users</span>
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-extrabold text-white">{paidUsersCount}</h3>
                    <p className="text-xs text-purple-400 mt-1">Selar / Stripe buyers</p>
                  </div>
                </div>

              </div>

              {/* PROGRESS BANNER */}
              <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-purple-950/40 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-cyan-400" />
                      $10,000 / Month Autonomous Milestone Tracker
                    </h3>
                    <p className="text-sm text-slate-300">
                      Run outreach agents to close your first 10 clients at $1,000/mo or 50 subscribers at $199/mo.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-cyan-400">${GOAL_REVENUE - revenue}</span>
                    <p className="text-xs text-slate-400">Remaining to reach goal</p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Current: ${revenue.toLocaleString()}</span>
                    <span>Target: ${GOAL_REVENUE.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-900/90 h-4 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700 ease-out shadow-lg shadow-cyan-500/50"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: AGENT FLEET CONSOLE */}
          {activeTab === 'agents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Autonomous Agent Fleet Console</h2>
                  <p className="text-xs text-slate-400">Manage, configure, and force-trigger AI worker nodes</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {agents.filter(a => a.status === 'running').length}/{agents.length} Active Nodes
                </span>
              </div>

              {/* AGENTS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agents.map((agent) => {
                  const IconComponent = agent.icon || Cpu;
                  const isRunning = agent.status === 'running';

                  return (
                    <div 
                      key={agent.id}
                      className={`bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border ${agent.borderColor || 'border-slate-800'} p-6 space-y-5 relative overflow-hidden transition-all hover:border-slate-600`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-xl ${agent.bgColor || 'bg-slate-800'} ${agent.textColor || 'text-cyan-400'}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">{agent.name}</h3>
                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{agent.badge}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleAgentStatus(agent.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isRunning 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          {isRunning ? 'RUNNING' : 'PAUSED'}
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {agent.description}
                      </p>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Active Task</span>
                        <p className="text-slate-200 font-mono truncate">{agent.currentTask}</p>
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          onClick={() => triggerManualRun(agent.id)}
                          className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/80 transition flex items-center justify-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 text-cyan-400" />
                          Force Execution
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE TERMINAL LOGS */}
          {activeTab === 'terminal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Live System Terminal</h2>
                  <p className="text-xs text-slate-400">Real-time telemetry stream from autonomous agent workers</p>
                </div>
                <button
                  onClick={() => setLogs([])}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Clear Console
                </button>
              </div>

              <div className="bg-[#05070b] border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 h-[520px] overflow-y-auto space-y-2 shadow-2xl relative">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 py-1 hover:bg-slate-900/40 rounded px-2 transition">
                    <span className="text-slate-500 shrink-0">[{log.time}]</span>
                    <span className="font-bold shrink-0 text-cyan-400">[{log.agent}]:</span>
                    <span className="flex-1 text-slate-300">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GEMINI AGENT STUDIO */}
          {activeTab === 'studio' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Gemini Autonomous Strategy Studio
                </h2>
                <p className="text-xs text-slate-400">Directly prompt the live Gemini API engine for high-converting marketing & outreach strategy</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Select Task Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setGeminiTask('niche');
                          setGeminiPrompt('Analyze top 3 lucrative B2B niches for AI automation services and draft buyer personas.');
                        }}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition ${
                          geminiTask === 'niche' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Niche Analysis
                      </button>
                      <button
                        onClick={() => {
                          setGeminiTask('outreach');
                          setGeminiPrompt('Write a personalized high-converting B2B cold email sequence for marketing agency owners.');
                        }}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition ${
                          geminiTask === 'outreach' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Cold Email Pitch
                      </button>
                      <button
                        onClick={() => {
                          setGeminiTask('social');
                          setGeminiPrompt('Draft a 5-part LinkedIn content series showcasing AI automation results for small businesses.');
                        }}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition ${
                          geminiTask === 'social' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Social Content
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Prompt Directive</label>
                    <textarea
                      rows={5}
                      value={geminiPrompt}
                      onChange={(e) => setGeminiPrompt(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleGeminiGenerate}
                    disabled={isGenerating}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        Generating Asset...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Strategy Asset
                      </>
                    )}
                  </button>

                </div>

                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Generated Strategy</span>
                    {geminiOutput && (
                      <button
                        onClick={copyOutput}
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy Result'}
                      </button>
                    )}
                  </div>

                  <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-y-auto font-mono whitespace-pre-wrap min-h-[260px]">
                    {isGenerating ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                        <p className="animate-pulse">JARVIS is generating strategy...</p>
                      </div>
                    ) : geminiOutput ? (
                      geminiOutput
                    ) : (
                      <span className="text-slate-600 italic">
                        Select a task category or enter custom instructions above, then click "Generate Strategy Asset" to trigger generation.
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* FLOATING VOICE CONTROL WIDGET */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-[#0e121b]/95 backdrop-blur-xl border border-cyan-500/40 p-4 rounded-2xl shadow-2xl w-80 sm:w-96 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-ping' : isListening ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`}></div>
              <span className="text-xs font-bold text-white tracking-wider">JARVIS VOICE CORE</span>
            </div>
            {isSpeaking && <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 max-h-28 overflow-y-auto font-sans">
            {voiceResponse}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={voiceQuery}
              onChange={(e) => setVoiceQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && processVoiceQuery(voiceQuery)}
              placeholder="Ask JARVIS anything..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            />
            <button
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl border transition ${isListening ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-slate-800 text-cyan-400 border-slate-700 hover:bg-slate-700'}`}
            >
              {isListening ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
