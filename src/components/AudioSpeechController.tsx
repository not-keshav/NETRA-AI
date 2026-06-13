/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Volume2, VolumeX, FastForward, Play, Square, Settings, RefreshCw } from "lucide-react";
import { getSpeakLanguageTag } from "../utils/languages";

interface AudioSpeechControllerProps {
  textToSpeak: string;
  langCode: string;
  isMuted: boolean;
  onMuteToggle: (muted: boolean) => void;
  onSpokenStart?: () => void;
  onSpokenEnd?: () => void;
}

export default function AudioSpeechController({
  textToSpeak,
  langCode,
  isMuted,
  onMuteToggle,
  onSpokenStart,
  onSpokenEnd
}: AudioSpeechControllerProps) {
  const [rate, setRate] = useState<number>(1.0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Whenever text or language changes, trigger auto-speak if NOT muted
  useEffect(() => {
    if (textToSpeak && !isMuted) {
      speakNow(textToSpeak);
    }
  }, [textToSpeak, langCode]);

  const speakNow = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop current speech
    setIsSpeaking(false);

    if (isMuted || !text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate voice tag based on target language
    const langTag = getSpeakLanguageTag(langCode);
    utterance.lang = langTag;
    utterance.rate = rate;

    // Attempt to match a voice
    if (availableVoices.length > 0) {
      const matched = availableVoices.find(v => v.lang.startsWith(langTag) || v.lang.includes(langTag.split("-")[0]));
      if (matched) {
        utterance.voice = matched;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (onSpokenStart) onSpokenStart();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onSpokenEnd) onSpokenEnd();
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis error:", e);
      setIsSpeaking(false);
      if (onSpokenEnd) onSpokenEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (onSpokenEnd) onSpokenEnd();
    }
  };

  const increaseSpeed = () => {
    const nextRate = Math.min(2.0, rate + 0.2);
    setRate(parseFloat(nextRate.toFixed(1)));
    setTimeout(() => {
      if (isSpeaking) {
        speakNow(textToSpeak);
      }
    }, 100);
  };

  const decreaseSpeed = () => {
    const nextRate = Math.max(0.6, rate - 0.2);
    setRate(parseFloat(nextRate.toFixed(1)));
    setTimeout(() => {
      if (isSpeaking) {
        speakNow(textToSpeak);
      }
    }, 100);
  };

  return (
    <div className="bg-neutral-900 border-4 border-yellow-400 p-8 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6" id="audio-control-panel">
      {/* Voice Status & Re-Speak */}
      <div className="flex items-center gap-5 w-full md:w-auto">
        <button
          onClick={() => onMuteToggle(!isMuted)}
          className={`p-6 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
            isMuted 
              ? "bg-red-656 hover:bg-red-700 text-white animate-pulse" 
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
          aria-label={isMuted ? "Unmute vocal voice narration" : "Mute vocal voice narration"}
          id="btn-voice-mute"
        >
          {isMuted ? <VolumeX className="w-10 h-10" /> : <Volume2 className="w-10 h-10" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-full ${isSpeaking ? "bg-emerald-400 animate-ping" : "bg-neutral-500"}`}></span>
            <p className="text-xl font-black text-yellow-400 uppercase tracking-widest font-mono">
              {isSpeaking ? "NARRATING SCENE" : isMuted ? "VOICE MUTED" : "SPEECH ENGINE STANDBY"}
            </p>
          </div>
          <p className="text-neutral-300 font-bold text-lg leading-snug uppercase tracking-wide mt-1">
            {isMuted 
              ? "Narrations are off. Press red button to unmute." 
              : isSpeaking 
                ? "Reading guidance out loud..." 
                : "Awaiting new accessibility reports."}
          </p>
        </div>
      </div>

      {/* Main Speak & Stop Action Block */}
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
        {textToSpeak && (
          <button
            onClick={() => speakNow(textToSpeak)}
            className="px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xl rounded-2xl flex items-center gap-3 transition-transform hover:scale-102 active:scale-95 shadow-md flex-1 md:flex-none justify-center cursor-pointer"
            id="btn-narrate-repeat"
          >
            <Play className="w-6 h-6 fill-current" />
            SAY AGAIN (REPEAT)
          </button>
        )}

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="px-6 py-4 bg-red-658 hover:bg-red-700 text-white font-black text-xl rounded-2xl flex items-center gap-3 transition-transform hover:scale-102 active:scale-95 shadow-md flex-1 md:flex-none justify-center cursor-pointer"
            id="btn-narrate-stop"
          >
            <Square className="w-6 h-6 fill-current" />
            STOP AUDIO
          </button>
        )}

        {/* Speed Sizer Controls */}
        <div className="flex items-center bg-black rounded-2xl border-4 border-neutral-700 p-1.5 divide-x-2 divide-neutral-800 w-full md:w-auto justify-center">
          <button
            onClick={decreaseSpeed}
            className="px-4 py-3 hover:bg-neutral-900 text-neutral-300 font-extrabold text-lg rounded-l-xl transition-colors cursor-pointer"
            title="Slower speed speech"
          >
            - SLOW
          </button>
          <div className="px-5 py-3 text-white font-black flex items-center gap-2 text-lg">
            <FastForward className="w-5 h-5 text-yellow-400" />
            {rate}x
          </div>
          <button
            onClick={increaseSpeed}
            className="px-4 py-3 hover:bg-neutral-900 text-neutral-300 font-extrabold text-lg rounded-r-xl transition-colors cursor-pointer"
            title="Faster speed speech"
          >
            FAST +
          </button>
        </div>
      </div>
    </div>
  );
}
