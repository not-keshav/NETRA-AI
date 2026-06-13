/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Compass, ShieldAlert, BrainCircuit, Contact, Eye, Sparkles } from "lucide-react";
import { SimulationScene } from "../types";

interface AIAgentConsoleProps {
  sceneData: SimulationScene;
  activeLanguageName: string;
}

export default function AIAgentConsole({ sceneData, activeLanguageName }: AIAgentConsoleProps) {
  const agentDetails = [
    {
      name: "Context Agent",
      role: "Situation Estimator",
      icon: Eye,
      color: "bg-teal-500",
      textColor: "text-teal-400",
      borderColor: "border-teal-500/30",
      status: "Analyzing",
      message: sceneData.agentCollaboration.ContextAgent
    },
    {
      name: "Navigation Agent",
      role: "GPS & Turn Guidance",
      icon: Compass,
      color: "bg-blue-500",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      status: "Plotting Paths",
      message: sceneData.agentCollaboration.NavigationAgent
    },
    {
      name: "Safety Agent",
      role: "Risk & Slip Guardrail",
      icon: ShieldAlert,
      color: "bg-amber-500",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/30",
      status: "Hazard Check",
      message: sceneData.agentCollaboration.SafetyAgent
    },
    {
      name: "Memory Agent",
      role: "History & Routines recall",
      icon: BrainCircuit,
      color: "bg-violet-500",
      textColor: "text-violet-400",
      borderColor: "border-violet-500/30",
      status: "Personalized",
      message: sceneData.agentCollaboration.MemoryAgent
    },
    {
      name: "Guardian Agent",
      role: "Emergency Safety Portal",
      icon: Contact,
      color: "bg-rose-500",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/30",
      status: "On Standby",
      message: sceneData.agentCollaboration.GuardianAgent
    }
  ];

  return (
    <div className="bg-neutral-900 rounded-[2.5rem] p-8 border-4 border-neutral-700" id="multi-agent-ecosystem-panel">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-neutral-800 pb-4 mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">
              NETRA Multi-Agent Collaboration
            </h2>
          </div>
          <p className="text-neutral-400 font-medium text-base">
            How specialists communicate observations under the hood, translating into human guidance in <span className="text-yellow-400 font-bold">{activeLanguageName}</span>.
          </p>
        </div>
        <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-center self-start sm:self-center">
          Eco-Sustained (ACTIVE)
        </div>
      </div>

      {/* Agents Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="agent-collaboration-grid">
        {agentDetails.map((agent, index) => {
          const Icon = agent.icon;
          return (
            <div
              key={index}
              className={`bg-black p-6 rounded-[2rem] border-4 border-neutral-800 flex flex-col justify-between transition-all hover:bg-neutral-950`}
              id={`agent-card-${agent.name.toLowerCase().replace(" ", "-")}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${agent.color} text-black font-black`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-lg tracking-wide leading-tight">
                        {agent.name}
                      </h3>
                      <p className="text-neutral-500 text-xs font-semibold leading-none">{agent.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full bg-neutral-800 uppercase ${agent.textColor}`}>
                    {agent.status}
                  </span>
                </div>
                <p className="text-neutral-300 font-bold text-base leading-relaxed mt-2 p-4 bg-neutral-900 rounded-2xl border border-neutral-850">
                  "{agent.message}"
                </p>
              </div>
            </div>
          );
        })}

        {/* Master Synthesis Agent */}
        <div className="bg-yellow-400 p-8 rounded-[2rem] text-black col-span-1 md:col-span-2 lg:col-span-3 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="bg-black text-yellow-400 p-4 rounded-2xl">
              <Sparkles className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-black tracking-tight uppercase leading-none">
                NETRA Central Vision Synthesizer
              </h3>
              <p className="text-neutral-900 font-bold text-lg mt-2 leading-snug">
                Receives observational payloads, checks collision threat risks, and executes translated speech synthesis alerts.
              </p>
            </div>
          </div>
          <div className="bg-black text-yellow-400 text-base font-black px-6 py-4 rounded-2xl uppercase tracking-widest border border-neutral-800 text-center w-full md:w-auto">
            100% Sync Ratio
          </div>
        </div>
      </div>
    </div>
  );
}
