import React, { useState, useEffect, useRef } from 'react';
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
  ShoppingCart, 
  HelpCircle, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Sliders, 
  Cpu, 
  Target,
  Send,
  Layers,
  BarChart3,
  Globe,
  Mail,
  Copy,
  Check
} from 'lucide-react';

// --- INITIAL DATA & CONSTANTS ---
const GOAL_REVENUE = 10000;

const INITIAL_METRICS = {
  currentMRR: 4280,
  dailyPayout: 312.50,
  leadsGenerated: 1420,
  activeSubscriptions: 86,
  conversionRate: 3.42,
  viralArticlesPublished: 42,
  supportTicketsResolved: 128
};

const INITIAL_AGENTS = [
  {
    id: 'content',
    name: 'Content & SEO Strategy Agent',
    icon: FileText,
    badge: 'Content',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    status: 'running',
    frequency: 'Every 30 mins',
    lastRun: '2 mins ago',
    processedCount: 142,
    yieldMRR: 1850,
    description: 'Generates SEO-optimized articles, social threads, and viral short clips to drive organic traffic.',
    currentTask: 'Analyzing trending dev keywords on X & Medium'
  },
  {
    id: 'outreach',
    name: 'Lead Gen & B2B Outreach Agent',
    icon: Mail,
    badge: 'Outreach',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    status: 'running',
    frequency: 'Every 15 mins',
    lastRun: '1 min ago',
    processedCount: 890,
    yieldMRR: 3200,
    description: 'Scrapes targeted SaaS founder leads, writes hyper-personalized cold emails & books demo calls.',
    currentTask: 'Drafting personalized outreach for 15 LinkedIn prospects'
  },
  {
    id: 'upsell',
    name: 'Product & Upsell Engine Agent',
    icon: ShoppingCart,
    badge: 'Monetization',
    color: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    status: 'running',
    frequency: 'Every 1 hour',
    lastRun: '12 mins ago',
    processedCount: 64,
    yieldMRR: 2450,
    description: 'Analyzes user usage patterns, triggers dynamic micro-upsells, and adjusts pricing tiers.',
    currentTask: 'Triggering Tier-2 annual upgrade sequences for high-usage users'
  },
  {
    id: 'support',
    name: 'Auto Support & Retention Agent',
    icon: HelpCircle,
    badge: 'Support',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    status: 'running',
    frequency: 'Real-time Webhook',
    lastRun: 'Just now',
    processedCount: 312,
    yieldMRR: 980,
    description: 'Resolves customer support tickets in under 30 seconds using trained AI model RAG context.',
    currentTask: 'Monitoring live chat queue & resolving refund queries'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [revenue, setRevenue] = useState(INITIAL_METRICS.currentMRR);
  const [dailyPayout, setDailyPayout] = useState(INITIAL_METRICS.dailyPayout);
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), agent: 'System', text: 'JARVIS Revenue Command Engine Initialized v4.2', type: 'info' },
    { id: 2, time: new Date().toLocaleTimeString(), agent: 'Outreach Agent', text: 'Captured 24 high-intent lead contacts from ProductHunt feed.', type: 'success' },
    { id: 3, time: new Date().toLocaleTimeString(), agent: 'Content Agent', text: 'Published article "10 AI Workflows to Automate SaaS" (Est reach: 12k).', type: 'success' },
    { id: 4, time: new Date().toLocaleTimeString(), agent: 'Upsell Agent', text: 'Converted user @alex_dev to Pro Annual Tier (+$290 MRR).', type: 'revenue' }
  ]);
  
  // Gemini Studio State
  const [geminiTask, setGeminiTask] = useState('outreach');
  const [geminiPrompt, setGeminiPrompt] = useState('Write a high-converting cold email pitch for a B2B SaaS target founder about AI automation.');
  const [geminiOutput, setGeminiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // System auto telemetry interval simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random agent automated ticks
      const randomAgentIndex = Math.floor(Math.random() * agents.length);
      const targetAgent = agents[randomAgentIndex];

      if (targetAgent.status === 'running') {
        const timestamp = new Date().toLocaleTimeString();
        let logMessage = '';
        let type = 'info';
        let revenueAdd = 0;

        switch (targetAgent.id) {
          case 'content':
            logMessage = `Content Agent published blog post: "Scaling Micro-SaaS with AI Automation". Traffic spiking +8%.`;
            type = 'success';
            break;
          case 'outreach':
            logMessage = `Outreach Agent dispatched 18 cold emails. 2 meeting links clicked.`;
            type = 'info';
            break;
          case 'upsell':
            revenueAdd = Math.floor(Math.random() * 45) + 15;
            logMessage = `Upsell Agent closed auto-upgrade subscription (+ $${revenueAdd} MRR).`;
            type = 'revenue';
            break;
          case 'support':
            logMessage = `Support Agent resolved ticket #4092 automatically (CSAT 5/5).`;
            type = 'success';
            break;
          default:
            logMessage = `Agent telemetry check completed. All nodes operational.`;
        }

        if (revenueAdd > 0) {
          setRevenue(prev => Math.min(GOAL_REVENUE, prev + revenueAdd));
          setDailyPayout(prev => prev + revenueAdd * 0.4);
        }

        setLogs(prevLogs => [
          {
            id: Date.now(),
            time: timestamp,
            agent: targetAgent.name.split(' ')[0] + ' Agent',
            text: logMessage,
            type: type
          },
          ...prevLogs.slice(0, 40) // Keep last 40 logs
        ]);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [agents]);

  // Handle Agent Toggle
  const toggleAgentStatus = (id) => {
    setAgents(agents.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'running' ? 'paused' : 'running';
        // Add log
        setLogs(prev => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            agent: 'Command Center',
            text: `Agent [${a.name}] state set to: ${nextStatus.toUpperCase()}`,
            type: nextStatus === 'running' ? 'success' : 'warn'
          },
          ...prev
        ]);
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  // Trigger Instant Manual Run
  const triggerManualRun = (id) => {
    const agent = agents.find(a => a.id === id);
    setLogs(prev => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        agent: agent.name.split(' ')[0] + ' Agent',
        text: `FORCE RUN INITIATED: Agent executing immediate autonomous batch cycle...`,
        type: 'info'
      },
      ...prev
    ]);

    // Simulate instant payout or result
    setTimeout(() => {
      const added = Math.floor(Math.random() * 75) + 20;
      setRevenue(prev => Math.min(GOAL_REVENUE, prev + added));
      setLogs(prev => [
        {
          id: Date.now() + 1,
          time: new Date().toLocaleTimeString(),
          agent: agent.name.split(' ')[0] + ' Agent',
          text: `FORCE RUN SUCCESS: Pipeline executed successfully (+ $${added} MRR added to pool).`,
          type: 'revenue'
        },
        ...prev
      ]);
    }, 1200);
  };

  // Call Gemini API for real content / lead / product generation
  const handleGeminiGenerate = async () => {
    if (!geminiPrompt.trim()) return;
    setIsGenerating(true);
    setGeminiOutput('');

    const systemInstruction = `You are JARVIS Autonomous AI Revenue Master. 
Your target is helping the user generate $10,000 MRR with AI agent automation. 
Provide extremely crisp, actionable, high-converting, professional outputs. No fluff. Write ready-to-use content.`;

    const userQuery = `Task Category: ${geminiTask.toUpperCase()}.\nInstruction: ${geminiPrompt}`;

    const apiKey = ""; // Canvas runtime auto-injects key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    let delay = 1000;
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] }
          })
        });

        if (!response.ok) {
          throw new Error(`API response status: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
        
        setGeminiOutput(generatedText);
        
        // Add log
        setLogs(prev => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            agent: 'Gemini Engine',
            text: `Generated custom AI artifact for task: [${geminiTask.toUpperCase()}].`,
            type: 'success'
          },
          ...prev
        ]);
        break;
      } catch (err) {
        console.warn(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, err);
        if (attempt === maxRetries - 1) {
          setGeminiOutput(`[Error calling Gemini API: ${err.message}. Please verify your API key configuration.]`);
        } else {
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
        }
      }
    }
    setIsGenerating(false);
  };

  const copyOutput = () => {
    if (!geminiOutput) return;
    navigator.clipboard.writeText(geminiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Percentage of $10,000 Goal
  const progressPercent = Math.min(100, Math.round((revenue / GOAL_REVENUE) * 100));

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* BACKGROUND GLOW DECORATIONS */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* TOP HEADER */}
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
            <p className="text-xs text-slate-400">Autonomous SaaS & Content Monetization System</p>
          </div>
        </div>

        {/* QUICK STAT HEADER BADGE */}
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

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1800px] w-full mx-auto p-4 lg:p-6 gap-6">

        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-64 flex flex-col space-y-2">
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
              <span>AI Agent Fleet ({agents.filter(a => a.status === 'running').length}/4)</span>
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

          {/* TARGET STATUS SUMMARY CARD */}
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
              <span>Estimated Velocity:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +$1,250/wk
              </span>
            </div>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 space-y-6 overflow-hidden">
          
          {/* TAB 1: REVENUE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              {/* TOP METRIC CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current MRR</span>
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-extrabold text-white">${revenue.toLocaleString()}</h3>
                    <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +42.8% target reached
                    </p>
                  </div>
                </div>

                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Auto Payout</span>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-extrabold text-white">${dailyPayout.toFixed(2)}</h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      Automated Stripe / Crypto routing
                    </p>
                  </div>
                </div>

                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Leads Scraped</span>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-extrabold text-white">{INITIAL_METRICS.leadsGenerated}</h3>
                    <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                      3.42% conversion rate
                    </p>
                  </div>
                </div>

                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Paid Users</span>
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-3xl font-extrabold text-white">{INITIAL_METRICS.activeSubscriptions}</h3>
                    <p className="text-xs text-purple-400 mt-1 flex items-center gap-1">
                      Avg ARR/user: $597
                    </p>
                  </div>
                </div>

              </div>

              {/* PROGRESS TO $10,000 BANNER */}
              <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-purple-950/40 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-cyan-400" />
                      $10,000 / Month Autonomous Milestone Tracker
                    </h3>
                    <p className="text-sm text-slate-300">
                      Agents are generating, outreaching, and closing deals 24/7 without manual intervention.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-cyan-400">${GOAL_REVENUE - revenue}</span>
                    <p className="text-xs text-slate-400">Remaining to reach goal</p>
                  </div>
                </div>

                {/* VISUAL PROGRESS BAR */}
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

              {/* REVENUE CHART & AGENT ATTRIBUTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* SVG CHART - REVENUE GROWTH TRAJECTORY */}
                <div className="lg:col-span-2 bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">MRR Growth Trajectory</h4>
                      <p className="text-xs text-slate-400">Actual vs Projected automated revenue</p>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Actual MRR
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span> Target Forecast
                      </span>
                    </div>
                  </div>

                  {/* SVG Chart Graphic */}
                  <div className="h-56 w-full pt-4">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="4 4" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="4 4" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="4 4" />

                      {/* Forecast Line */}
                      <path
                        d="M 0,130 Q 125,100 250,60 T 500,10"
                        fill="none"
                        stroke="#334155"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                      />

                      {/* Actual MRR Line */}
                      <path
                        d="M 0,140 Q 100,110 200,90 T 350,50 T 500,25"
                        fill="none"
                        stroke="url(#cyanGrad)"
                        strokeWidth="3"
                      />

                      {/* Area Fill */}
                      <path
                        d="M 0,140 Q 100,110 200,90 T 350,50 T 500,25 L 500,150 L 0,150 Z"
                        fill="url(#cyanArea)"
                        opacity="0.2"
                      />

                      <defs>
                        <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                        <linearGradient id="cyanArea" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>

                      {/* Data Points */}
                      <circle cx="200" cy="90" r="4" fill="#06b6d4" />
                      <circle cx="350" cy="50" r="4" fill="#06b6d4" />
                      <circle cx="500" cy="25" r="5" fill="#10b981" className="animate-pulse" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4 (Current)</span>
                    <span>Goal ($10k)</span>
                  </div>
                </div>

                {/* AGENT REVENUE CONTRIBUTION */}
                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
                  <h4 className="text-sm font-bold text-white">Revenue Attribution by Agent</h4>
                  
                  <div className="space-y-4 pt-1">
                    {agents.map(agent => (
                      <div key={agent.id} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-300">{agent.name.split(' ')[0]} Agent</span>
                          <span className="text-white font-bold">${agent.yieldMRR}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${agent.color}`}
                            style={{ width: `${(agent.yieldMRR / revenue) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-800/80">
                    <div className="p-3 bg-cyan-500/5 rounded-xl border border-cyan-500/20 text-xs text-cyan-300">
                      <p className="font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Autonomous System Insight
                      </p>
                      <p className="text-slate-400 mt-1">
                        Outreach Agent yields highest direct conversion. Recommend allocating +20% run cycles to B2B Lead Scraping.
                      </p>
                    </div>
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
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Active Node Status:</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    4/4 Operational
                  </span>
                </div>
              </div>

              {/* AGENTS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agents.map((agent) => {
                  const IconComponent = agent.icon;
                  const isRunning = agent.status === 'running';

                  return (
                    <div 
                      key={agent.id}
                      className={`bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border ${agent.borderColor} p-6 space-y-5 relative overflow-hidden transition-all hover:border-slate-600`}
                    >
                      {/* Top Bar */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-xl ${agent.bgColor} ${agent.textColor} border ${agent.borderColor}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white">{agent.name}</h3>
                            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{agent.badge}</span>
                          </div>
                        </div>

                        {/* Status Toggle Button */}
                        <button
                          onClick={() => toggleAgentStatus(agent.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isRunning 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                          }`}
                        >
                          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          {isRunning ? 'RUNNING' : 'PAUSED'}
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {agent.description}
                      </p>

                      {/* Live Task Indicator */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Active Task</span>
                        <p className="text-slate-200 font-mono truncate">{agent.currentTask}</p>
                      </div>

                      {/* Metrics Footer */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Frequency</p>
                          <p className="text-xs font-bold text-slate-200 mt-0.5">{agent.frequency}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Yield (MRR)</p>
                          <p className="text-xs font-bold text-cyan-400 mt-0.5">${agent.yieldMRR}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Total Tasks</p>
                          <p className="text-xs font-bold text-slate-200 mt-0.5">{agent.processedCount}</p>
                        </div>
                      </div>

                      {/* Action Triggers */}
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

              {/* TERMINAL CONTAINER */}
              <div className="bg-[#05070b] border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 h-[520px] overflow-y-auto space-y-2 shadow-2xl relative">
                <div className="sticky top-0 bg-[#05070b]/90 backdrop-blur pb-2 mb-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>JARVIS TELEMETRY DEPLOYMENT // NODE: PRODUCTION-US-EAST</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    STREAMING LIVE
                  </span>
                </div>

                {logs.length === 0 ? (
                  <p className="text-slate-600 italic">No logs recorded. Waiting for agent activity...</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 py-1 hover:bg-slate-900/40 rounded px-2 transition">
                      <span className="text-slate-500 shrink-0">[{log.time}]</span>
                      <span className={`font-bold shrink-0 ${
                        log.agent.includes('Content') ? 'text-blue-400' :
                        log.agent.includes('Outreach') ? 'text-emerald-400' :
                        log.agent.includes('Upsell') ? 'text-purple-400' : 'text-amber-400'
                      }`}>
                        [{log.agent}]:
                      </span>
                      <span className={`flex-1 ${
                        log.type === 'revenue' ? 'text-emerald-300 font-semibold' :
                        log.type === 'success' ? 'text-slate-200' :
                        log.type === 'warn' ? 'text-amber-300' : 'text-slate-400'
                      }`}>
                        {log.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GEMINI AGENT STUDIO */}
          {activeTab === 'studio' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Gemini Autonomous Content & Outreach Studio
                </h2>
                <p className="text-xs text-slate-400">Directly prompt the live Gemini API engine for high-converting marketing & cold outreach assets</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* PROMPT CONTROLS */}
                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 space-y-4">
                  
                  {/* Select Task Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Select Task Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setGeminiTask('outreach');
                          setGeminiPrompt('Write a personalized high-converting B2B cold outreach email to pitch an AI productivity tool to a Tech Founder.');
                        }}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition ${
                          geminiTask === 'outreach' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Cold Outreach
                      </button>
                      <button
                        onClick={() => {
                          setGeminiTask('content');
                          setGeminiPrompt('Write a viral 5-part X/Twitter thread breaking down how AI agents can automate a $10,000/mo Micro-SaaS business.');
                        }}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition ${
                          geminiTask === 'content' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Viral Post
                      </button>
                      <button
                        onClick={() => {
                          setGeminiTask('product');
                          setGeminiPrompt('Propose 3 profitable Micro-SaaS ideas with target pricing tiers, target audience, and key AI feature stack.');
                        }}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-center transition ${
                          geminiTask === 'product' ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Micro-SaaS Ideas
                      </button>
                    </div>
                  </div>

                  {/* Prompt Text Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Prompt / Agent Directive</label>
                    <textarea
                      rows={5}
                      value={geminiPrompt}
                      onChange={(e) => setGeminiPrompt(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-none font-sans"
                      placeholder="Enter custom directives for the Gemini Agent Engine..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleGeminiGenerate}
                    disabled={isGenerating}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        Generating with Gemini API...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Strategy Asset
                      </>
                    )}
                  </button>

                </div>

                {/* OUTPUT DISPLAY */}
                <div className="bg-[#0e121b]/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-5 flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Generated Output</span>
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
                        <p className="animate-pulse">JARVIS is querying Gemini 3 Flash Preview...</p>
                      </div>
                    ) : geminiOutput ? (
                      geminiOutput
                    ) : (
                      <span className="text-slate-600 italic">
                        Select a task category or enter custom instructions above, then click "Generate Strategy Asset" to trigger live generation.
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}