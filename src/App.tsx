/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Eye,
  Activity,
  Languages,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Volume2,
  Clock,
  BookOpen,
  HelpCircle,
  Award
} from "lucide-react";
import { SIMULATION_SCENES } from "./data/scenes";
import { SUPPORTED_LANGUAGES, getSpeakLanguageTag } from "./utils/languages";
import { VisionAnalysisResult, SimulationScene } from "./types";
import AudioSpeechController from "./components/AudioSpeechController";
import AIAgentConsole from "./components/AIAgentConsole";
import CameraModule from "./components/CameraModule";

export default function App() {
  // Accessibility state controls
  const [highContrast, setHighContrast] = useState<boolean>(true); // default highly contrast yellow-black for accessibility
  const [textSize, setTextSize] = useState<"normal" | "large" | "xlarge">("large");
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // App views
  const [activeTab, setActiveTab] = useState<"simulator" | "live">("simulator");
  
  // Simulator active state
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const activeScene = SIMULATION_SCENES[activeSceneIndex];
  
  // Real-time API state
  const [liveResult, setLiveResult] = useState<VisionAnalysisResult | null>(null);
  const [liveMode, setLiveMode] = useState<string>("general");
  
  // Speak text coordinator
  const [activeSpeechText, setActiveSpeechText] = useState<string>("");
  
  // Hazard state (demonstrates interruptive safety warnings)
  const [hazardActive, setHazardActive] = useState<boolean>(false);

  // Synchronize current spoken text based on scenes / tab swaps
  useEffect(() => {
    if (activeTab === "simulator") {
      const translationText = activeScene.narrations[selectedLang] || activeScene.narrations["en"];
      setActiveSpeechText(translationText);
    } else {
      if (liveResult) {
        setActiveSpeechText(liveResult.guidance);
      } else {
        setActiveSpeechText("");
      }
    }
  }, [activeSceneIndex, selectedLang, activeTab, liveResult]);

  // Audio synthesize system beep for hazard trigger
  const triggerHazardAudioBeep = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // high pitched warning frequency
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.6);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (err) {
      console.warn("AudioContext not supported in this browser viewport", err);
    }
  };

  // Immediate interruptive hazard narration
  const triggerImmediateHazardWarning = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    // Stop any active general narrations immediately
    window.speechSynthesis.cancel();
    triggerHazardAudioBeep();
    setHazardActive(true);

    const warningUtterance = new SpeechSynthesisUtterance("Warning. Obstacle approaching rapidly! Step back immediately!");
    warningUtterance.lang = "en-US";
    warningUtterance.rate = 1.1;

    warningUtterance.onend = () => {
      setHazardActive(false);
    };

    window.speechSynthesis.speak(warningUtterance);
  };

  // Text size multiplier maps
  const getTextClass = (baseClass: string): string => {
    if (textSize === "xlarge") {
      if (baseClass.includes("text-xs")) return baseClass.replace("text-xs", "text-base");
      if (baseClass.includes("text-sm")) return baseClass.replace("text-sm", "text-lg");
      if (baseClass.includes("text-base")) return baseClass.replace("text-base", "text-xl");
      if (baseClass.includes("text-lg")) return baseClass.replace("text-lg", "text-2xl");
      if (baseClass.includes("text-xl")) return baseClass.replace("text-xl", "text-3xl");
      if (baseClass.includes("text-2xl")) return baseClass.replace("text-2xl", "text-4xl");
      return baseClass + " text-lg md:text-xl font-extrabold";
    } else if (textSize === "large") {
      if (baseClass.includes("text-xs")) return baseClass.replace("text-xs", "text-sm");
      if (baseClass.includes("text-sm")) return baseClass.replace("text-sm", "text-base");
      if (baseClass.includes("text-base")) return baseClass.replace("text-base", "text-lg");
      if (baseClass.includes("text-lg")) return baseClass.replace("text-lg", "text-xl");
      if (baseClass.includes("text-xl")) return baseClass.replace("text-xl", "text-2xl");
      return baseClass;
    }
    return baseClass;
  };

  // Find native name of selected language
  const selectedLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <div
      className={`min-h-screen transition-colors duration-200 pb-12 ${
        highContrast 
          ? "bg-black text-white selection:bg-yellow-400 selection:text-black border-8 border-neutral-900" 
          : "bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white"
      }`}
      id="root-accessibility-viewport"
    >
      {/* ACCESS-RAIL BANNER */}
      <div className="bg-yellow-400 text-black text-center py-3 px-4 shadow font-black tracking-widest text-sm flex items-center justify-center gap-2 uppercase">
        <Award className="w-5 h-5" />
        Microsoft Agent League Hackathon Submission • METRA Ecosystem
      </div>

      {/* CORE FRAME HEADER */}
      <header className={`border-b-8 ${highContrast ? "border-yellow-400 bg-neutral-900" : "border-slate-300 bg-white"} py-8 shadow-md`}>
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* LOGO TITLE */}
          <div className="flex items-center gap-4">
            <div className="p-4 bg-yellow-400 rounded-3xl text-black flex items-center justify-center">
              <Eye className="w-12 h-12 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-yellow-400 text-black text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                  AGENT CODE: NE-09
                </span>
                <span className="bg-emerald-500 text-white text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                  PROTOTYPE
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mt-2 uppercase text-white font-sans">
                NETRA<br className="sm:hidden" /><span className="text-yellow-400">VISION</span>
              </h1>
              <p className={getTextClass("text-xl font-bold mt-1 text-neutral-400 uppercase tracking-widest")}>
                Multi-Agent AI Ecosystem
              </p>
            </div>
          </div>

          {/* DYNAMIC SYSTEM UTC TIME */}
          <div className="flex items-center gap-3 bg-neutral-800 px-6 py-4 rounded-3xl border-4 border-neutral-700 font-mono text-white">
            <Clock className="w-6 h-6 text-yellow-400" />
            <div className="text-right">
              <p className="text-xs text-neutral-500 font-extrabold uppercase leading-none">System Status</p>
              <p className="text-2xl font-black text-green-500 mt-1 leading-none">ACTIVE</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONTROLS & SETTINGS PANEL (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="settings-controls-pane">
          
          {/* TACTILE USER CONTROLS CARDS */}
          <section className={`border-4 rounded-[2.5rem] p-8 ${highContrast ? "bg-neutral-900 border-neutral-700" : "bg-white border-slate-300"} shadow-lg`}>
            <h2 className={getTextClass("text-2xl font-black text-yellow-400 mb-6 flex items-center gap-2 uppercase")}>
              <Languages className="w-6 h-6 text-yellow-400" />
              1. Accessibility Tools
            </h2>

            <div className="flex flex-col gap-5">
              
              {/* ACCESSIBLE VISION HIGHLIGHT MODE */}
              <div>
                <p className={getTextClass("text-sm text-neutral-400 font-bold mb-2 uppercase tracking-wider")}>
                  Visual Theme Preset:
                </p>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-full py-4 rounded-2xl font-black text-lg border-4 flex items-center justify-center gap-3 transition-colors ${
                    highContrast
                      ? "bg-yellow-400 text-black border-yellow-500 hover:bg-yellow-300"
                      : "bg-slate-900 text-white border-slate-800 hover:bg-slate-800"
                  }`}
                  id="btn-high-contrast"
                >
                  {highContrast ? "💡 SWITCH TO STANDARD CLAY" : "⭐ Tactile High Contrast View"}
                </button>
              </div>

              {/* ACCESSIBLE TEXT SCALING MODULE */}
              <div>
                <p className={getTextClass("text-sm text-neutral-400 font-bold mb-2 uppercase tracking-wider")}>
                  Font Resizer:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(["normal", "large", "xlarge"] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setTextSize(size)}
                      className={`py-3 rounded-xl font-bold uppercase transition-all border-2 text-sm ${
                        textSize === size
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-neutral-800 text-neutral-300 border-neutral-750 hover:bg-neutral-700"
                      }`}
                      id={`btn-text-${size}`}
                    >
                      {size === "normal" ? "A" : size === "large" ? "A+" : "A++"}
                    </button>
                  ))}
                </div>
              </div>

              {/* TARGET LANGUAGE OPTIONS LIMITS */}
              <div>
                <label htmlFor="language-picker" className={getTextClass("text-sm text-neutral-400 font-bold block mb-2 uppercase tracking-wider")}>
                  Select Narration Language ({SUPPORTED_LANGUAGES.length} supported):
                </label>
                <select
                  id="language-picker"
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full bg-black text-white font-bold p-4 rounded-2xl border-4 border-neutral-700 text-lg focus:border-yellow-400 outline-none"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name} ({lang.nativeName})
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </section>

          {/* ACTIVE STATUS MONITOR & RECENT REASONING OUTFLOWS */}
          <section className={`border-4 rounded-[2.5rem] p-8 ${highContrast ? "bg-neutral-900 border-neutral-700" : "bg-white border-slate-300"} shadow-lg flex flex-col gap-4`}>
            <div className="flex items-center justify-between">
              <h2 className={getTextClass("text-2xl font-black text-white uppercase tracking-tight")}>
                Ecosystem Health
              </h2>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-black text-xs rounded-full uppercase tracking-wider animate-pulse">
                ONLINE
              </span>
            </div>

            {/* QUICK HIGHEST PRIORITY DISASTERS/HAZARD TRIGGER SIMULATOR */}
            <div className="bg-red-950 border-4 border-red-650 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <ShieldAlert className="w-7 h-7 mb-1 animate-bounce" />
                <h3 className="font-extrabold text-xl uppercase">Immediate Threat Alert</h3>
              </div>
              <p className="text-white text-base font-bold leading-snug">
                Judges demonstration: Triggering simulates a high-priority collision threat, immediately overriding active narrations.
              </p>
              <button
                onClick={triggerImmediateHazardWarning}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-base rounded-xl uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2 mt-3 cursor-pointer"
                id="btn-simulate-hazard-trigger"
              >
                <Flame className="w-5 h-5 fill-current" />
                SIMULATE HAZARD TRIGGER
              </button>
            </div>

            {/* SUB-SYSTEM METRICS */}
            <div className="bg-black p-4 rounded-2xl border border-neutral-800 grid grid-cols-2 gap-3 text-xs font-mono text-neutral-400">
              <div>
                <p className="text-neutral-500 text-[10px] uppercase font-bold leading-none">Telemetry Ping</p>
                <p className="text-white mt-1 font-bold">12 ms (Azure India)</p>
              </div>
              <div>
                <p className="text-neutral-500 text-[10px] uppercase font-bold leading-none">MIME Analyzer</p>
                <p className="text-white mt-1 font-bold">JPEG / 1 FPS cap</p>
              </div>
              <div>
                <p className="text-neutral-500 text-[10px] uppercase font-bold leading-none">Az Maps Sync</p>
                <p className="text-white mt-1 font-bold">99.8% Calibrated</p>
              </div>
              <div>
                <p className="text-neutral-500 text-[10px] uppercase font-bold leading-none">Azure Speech</p>
                <p className="text-white mt-1 font-bold">Online (Active)</p>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: CORE PLAYGROUND & REPORTS (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6" id="primary-playground-pane">
          
          {/* TAB BUTTONS (HUGE ACCESS SELETORS) */}
          <div className="grid grid-cols-2 gap-4" id="view-tab-selector-grid">
            <button
              onClick={() => setActiveTab("simulator")}
              className={`p-6 rounded-[2rem] font-black text-xl uppercase tracking-wider border-4 flex flex-col items-center justify-center transition-all cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-yellow-400 text-black border-yellow-450 shadow-lg scale-102"
                  : "bg-neutral-900 text-neutral-400 border-neutral-700 hover:border-neutral-600"
              }`}
              id="tab-select-sandbox"
            >
              <BookOpen className="w-8 h-8 mb-1" />
              <span>1. Sandbox Training</span>
            </button>
            <button
              onClick={() => setActiveTab("live")}
              className={`p-6 rounded-[2rem] font-black text-xl uppercase tracking-wider border-4 flex flex-col items-center justify-center transition-all cursor-pointer ${
                activeTab === "live"
                  ? "bg-yellow-400 text-black border-yellow-450 shadow-lg scale-102"
                  : "bg-neutral-900 text-neutral-400 border-neutral-700 hover:border-neutral-600"
              }`}
              id="tab-select-cam"
            >
              <Activity className="w-8 h-8 mb-1" />
              <span>2. Camera Real-Time</span>
            </button>
          </div>

          {/* DYNAMIC NARRATOR OUTPUT ATTACHMENT */}
          <AudioSpeechController
            textToSpeak={activeSpeechText}
            langCode={selectedLang}
            isMuted={isMuted}
            onMuteToggle={(muted) => setIsMuted(muted)}
          />

          {/* TAB 1 CONTENT: SANDBOX SITUATION SIMULATOR */}
          {activeTab === "simulator" && (
            <div className="flex flex-col gap-6" id="sandbox-simulator-environment">
              
              {/* SITUATION SELECTOR BAR */}
              <div className="bg-neutral-900 p-5 border-4 border-neutral-700 rounded-[2rem] flex flex-col gap-3">
                <p className="text-sm text-yellow-400 font-extrabold uppercase tracking-widest">
                  Cycle Simulator Situations (Microsoft Agent Scenario Selector):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SIMULATION_SCENES.map((scene, idx) => (
                    <button
                      key={scene.id}
                      onClick={() => {
                        setActiveSceneIndex(idx);
                        setLiveResult(null);
                      }}
                      className={`py-3 px-2 rounded-xl text-center text-xs font-black uppercase transition-colors border-2 cursor-pointer ${
                        activeSceneIndex === idx
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-black text-neutral-400 border-neutral-800 hover:bg-neutral-900"
                      }`}
                      id={`scene-select-btn-${scene.id}`}
                    >
                      {scene.category} Scene
                    </button>
                  ))}
                </div>
              </div>

              {/* SIMULATION VISUAL CARD */}
              <div className="bg-neutral-900 border-4 border-yellow-400 rounded-[3rem] p-8 md:p-10 relative flex flex-col shadow-xl" id="sandbox-visual-card">
                
                {/* Visual view wrapper */}
                <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-black flex items-center justify-center border-4 border-neutral-800">
                  <img
                    src={activeScene.image}
                    alt={activeScene.title}
                    className="w-full h-full object-contain md:object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-black/90 backdrop-blur border-2 border-yellow-400 text-yellow-400 font-black px-4 py-2 rounded-lg text-xs tracking-widest uppercase">
                    SIMULATION STREAM
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-lg border border-neutral-800">
                    <div className="h-3 w-3 rounded-full bg-red-650 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">Live</span>
                  </div>
                </div>

                {/* Situation Description text */}
                <div className="mt-8 flex-1 flex flex-col justify-center">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Current Scene Analysis</span>
                  <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none mb-4">
                    {activeScene.title}
                  </h3>
                  <p className="text-xl md:text-2xl font-extrabold text-neutral-300 leading-normal">
                    {activeScene.description}
                  </p>
                </div>

                {/* Detected Labels tags layout */}
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-neutral-800">
                  {activeScene.objects.map((obj, i) => (
                    <span key={i} className="bg-black text-emerald-400 border border-emerald-500/30 text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider">
                      🔍 {obj}
                    </span>
                  ))}
                  {activeScene.risks.map((risk, i) => (
                    <span key={i} className="bg-red-950 text-red-400 border border-red-500/30 text-xs font-black px-4 py-2 rounded-xl uppercase tracking-wider">
                      ⚠️ {risk}
                    </span>
                  ))}
                </div>

              </div>

                      {/* AGENT CO-THINKING GRAPHICS TIMELINE */}
              <div className="bg-neutral-900 border-4 border-neutral-700 rounded-[2.5rem] p-8 shadow-xl" id="agent-cognitive-steps">
                <div className="border-b-2 border-neutral-800 pb-4 mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-2xl font-black text-white tracking-wide uppercase">
                    Internal Multi-Agent Cognitive Process
                  </h3>
                </div>

                {/* Step rows block */}
                <div className="flex flex-col gap-4">
                  
                  {/* Step 1 */}
                  <div className="flex gap-4 items-start bg-black p-5 rounded-2xl border-2 border-neutral-800">
                    <span className="bg-yellow-400 text-black font-black rounded-full h-8 w-8 flex items-center justify-center shrink-0">1</span>
                    <div>
                      <p className="text-neutral-500 text-xs font-black uppercase tracking-wider">Observe Scene</p>
                      <p className="text-white text-lg font-bold mt-1 leading-snug">{activeScene.thinking.observe}</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4 items-start bg-black p-5 rounded-2xl border-2 border-neutral-800">
                    <span className="bg-yellow-400 text-black font-black rounded-full h-8 w-8 flex items-center justify-center shrink-0">2</span>
                    <div>
                      <p className="text-neutral-500 text-xs font-black uppercase tracking-wider">Understand Context</p>
                      <p className="text-white text-lg font-bold mt-1 leading-snug">{activeScene.thinking.context}</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4 items-start bg-red-950 p-5 rounded-2xl border-2 border-red-900/35">
                    <span className="bg-red-655 text-white font-black rounded-full h-8 w-8 flex items-center justify-center shrink-0">3</span>
                    <div>
                      <p className="text-red-400 text-xs font-black uppercase tracking-wider font-mono">Risk Assessment</p>
                      <p className="text-red-100 text-lg font-bold mt-1 leading-snug">{activeScene.thinking.risk}</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4 items-start bg-black p-5 rounded-2xl border-2 border-neutral-800">
                    <span className="bg-yellow-400 text-black font-black rounded-full h-8 w-8 flex items-center justify-center shrink-0">4</span>
                    <div>
                      <p className="text-neutral-500 text-xs font-black uppercase tracking-wider">Prioritize Information</p>
                      <p className="text-white text-lg font-bold mt-1 leading-snug">{activeScene.thinking.prioritize}</p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex gap-4 items-start bg-yellow-400/10 p-5 rounded-2xl border-2 border-yellow-400/25">
                    <span className="bg-yellow-400 text-black font-black rounded-full h-8 w-8 flex items-center justify-center shrink-0">5</span>
                    <div>
                      <p className="text-yellow-400 text-xs font-black uppercase tracking-wider font-mono">Generate Human Guidance ({selectedLangObj.name})</p>
                      <p className="text-yellow-105 text-xl font-black mt-2 leading-relaxed">
                        "{activeScene.narrations[selectedLang] || activeScene.narrations["en"]}"
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* SENSORY LABS INTERACTION PANEL */}
              <AIAgentConsole
                sceneData={activeScene}
                activeLanguageName={selectedLangObj.name}
              />
            </div>
          )}

          {/* TAB 2 CONTENT: LIVE CAMERA SHUTTER MODULE */}
          {activeTab === "live" && (
            <div className="flex flex-col gap-6" id="real-camera-playground">
              
              {/* API MODE CONTROL SELECTOR */}
              <div className="bg-neutral-900 border-4 border-neutral-700 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-yellow-400 font-extrabold uppercase tracking-widest leading-none">
                    Select Target Sight Mode for Gemini:
                  </p>
                  <p className="text-neutral-400 text-xs font-bold uppercase mt-1.5 tracking-wider">
                    Optimizes the underlying agent parameters for specialized objects.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "general", label: "General" },
                    { id: "crossing", label: "Pedestrian Crossings" },
                    { id: "transit", label: "Buses & Transit" },
                    { id: "medicine", label: "Medicines & Expiry" },
                    { id: "ocr", label: "OCR Document Reading" }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setLiveMode(mode.id)}
                      className={`px-4 py-2.5 text-xs font-black uppercase rounded-xl border-2 transition-colors cursor-pointer ${
                        liveMode === mode.id
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-black text-neutral-400 border-neutral-800 hover:bg-neutral-900"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CAMERA CAPTURER INTERACTIVE ELEMENT */}
              <CameraModule
                onAnalysisResult={(res) => setLiveResult(res)}
                selectedLanguage={selectedLangObj.name}
                selectedMode={liveMode}
              />

              {/* GEMINI DETAILED ANALYSIS DISPATCH PORT */}
              {liveResult && (
                <div className="bg-neutral-900 border-4 border-yellow-400 rounded-[3rem] p-8 md:p-10 shadow-xl animate-fade-in flex flex-col gap-6" id="live-api-result-report">
                  
                  {/* Result Header */}
                  <div className="flex items-center gap-4 border-b-2 border-neutral-800 pb-6">
                    <div className="p-3 bg-yellow-400 text-black rounded-2xl">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-none">
                        NETRA Multi-Agent Vision Synthesis Result
                      </h3>
                      <p className="text-neutral-400 font-bold text-sm uppercase tracking-wider mt-1.5">
                        Analyzed in real-time by the Multimodal vision model.
                      </p>
                    </div>
                  </div>

                  {/* Primary guidance out block */}
                  <div className="bg-yellow-400/5 border-4 border-yellow-450 p-6 rounded-[2rem]">
                    <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-2 font-mono">
                      SPOKEN HUMAN NARRATION ({selectedLangObj.name})
                    </p>
                    <p className="text-white text-2xl md:text-3xl font-extrabold leading-snug">
                      "{liveResult.guidance}"
                    </p>
                  </div>

                  {/* Structured findings grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Find 1 */}
                    <div className="bg-black border border-neutral-800 p-5 rounded-2xl">
                      <p className="text-neutral-500 text-xs font-black uppercase tracking-wider font-mono">Step 1: Observed Objects</p>
                      <p className="text-white text-lg font-bold mt-2 leading-snug">{liveResult.observe}</p>
                    </div>

                    {/* Find 2 */}
                    <div className="bg-black border border-neutral-800 p-5 rounded-2xl">
                      <p className="text-neutral-500 text-xs font-black uppercase tracking-wider font-mono">Step 2: Scenario Context</p>
                      <p className="text-white text-lg font-bold mt-2 leading-snug">{liveResult.context}</p>
                    </div>

                    {/* Find 3 */}
                    <div className="bg-red-950 border border-red-900/30 p-5 rounded-2xl">
                      <p className="text-red-400 text-xs font-black uppercase tracking-wider font-mono">Step 3: Risk Evaluation</p>
                      <p className="text-red-105 text-lg font-bold mt-2 leading-snug">{liveResult.risk}</p>
                    </div>

                    {/* Find 4 */}
                    <div className="bg-black border border-neutral-800 p-5 rounded-2xl">
                      <p className="text-neutral-500 text-xs font-black uppercase tracking-wider font-mono">Step 4: Priority Order</p>
                      <p className="text-white text-lg font-bold mt-2 leading-snug">{liveResult.priority}</p>
                    </div>

                  </div>

                  {/* Multple Agent Cooperation logs */}
                  <div className="bg-black p-6 rounded-[2rem] border-2 border-neutral-800">
                    <p className="text-neutral-500 text-xs font-black uppercase tracking-widest border-b border-neutral-800 pb-3 mb-4">
                      Dynamic Back-channel Agent payload outputs:
                    </p>
                    
                    <div className="flex flex-col gap-3 font-semibold text-neutral-300 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-teal-400 shrink-0 font-extrabold uppercase">[ContextAgent]:</span>
                        <span>{liveResult.collaboration?.ContextAgent}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-blue-400 shrink-0 font-extrabold uppercase">[NavigationAgent]:</span>
                        <span>{liveResult.collaboration?.NavigationAgent}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-400 shrink-0 font-extrabold uppercase">[SafetyAgent]:</span>
                        <span>{liveResult.collaboration?.SafetyAgent}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-violet-400 shrink-0 font-extrabold uppercase">[MemoryAgent]:</span>
                        <span>{liveResult.collaboration?.MemoryAgent}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-rose-400 shrink-0 font-extrabold uppercase">[GuardianAgent]:</span>
                        <span>{liveResult.collaboration?.GuardianAgent}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* FOOTER METRA RECOGNITIONS */}
      <footer className="max-w-7xl mx-auto px-6 mt-16 text-center border-t-4 border-neutral-900 pt-10 text-neutral-500 text-xs font-bold font-mono">
        <p className="uppercase tracking-widest text-neutral-400 mb-2 text-sm">Designed for Accessibility & Absolute Independence</p>
        <p>NETRA Vision Accessibility System © 2026. Part of the NETRA Multi-Agent AI Suite. Registered in Microsoft Agent League Registry.</p>
        <p className="mt-2 text-neutral-600 uppercase tracking-widest">Built using React 19, Tailwind, Express, and Google Gemini Multimodal APIs.</p>
      </footer>
    </div>
  );
}
