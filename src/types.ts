/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AgentLog {
  agentName: string;
  status: 'idle' | 'working' | 'ready' | 'alert';
  message: string;
  timestamp: string;
}

export interface SimulationScene {
  id: string;
  title: string;
  category: 'Crossing' | 'Transit' | 'Medicine' | 'Obstacle';
  image: string;
  description: string;
  objects: string[];
  risks: string[];
  thinking: {
    observe: string;
    context: string;
    risk: string;
    prioritize: string;
    speak: string;
  };
  narrations: {
    [langCode: string]: string; // Language code -> spoken guidance
  };
  agentCollaboration: {
    ContextAgent: string;
    NavigationAgent: string;
    SafetyAgent: string;
    MemoryAgent: string;
    GuardianAgent: string;
  };
}

export interface LanguageSetting {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

export interface VisionAnalysisResult {
  observe: string;
  context: string;
  risk: string;
  priority: string;
  guidance: string;
  collaboration: {
    ContextAgent: string;
    NavigationAgent: string;
    SafetyAgent: string;
    MemoryAgent: string;
    GuardianAgent: string;
  };
}
