/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, AlertCircle, Sparkles, RefreshCw, Eye, CheckCircle } from "lucide-react";
import { VisionAnalysisResult } from "../types";

interface CameraModuleProps {
  onAnalysisResult: (result: VisionAnalysisResult | null) => void;
  selectedLanguage: string;
  selectedMode: string;
}

export default function CameraModule({
  onAnalysisResult,
  selectedLanguage,
  selectedMode
}: CameraModuleProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const loadingSteps = [
    "Context Agent scanning situational surroundings...",
    "Navigation Agent calculating pathway boundaries...",
    "Safety Agent evaluating immediate collision risks...",
    "Parsing medicine labels and vital specifications...",
    "Executing Multilingual speech translation formulas...",
    "Synchronizing multi-agent observational logs..."
  ];

  // Rotate loading messages while fetching GenAI explanation
  useEffect(() => {
    let interval: any = null;
    if (loading) {
      let stepIndex = 0;
      setLoadingMessage(loadingSteps[0]);
      interval = setInterval(() => {
        stepIndex = (stepIndex + 1) % loadingSteps.length;
        setLoadingMessage(loadingSteps[stepIndex]);
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const startCamera = async () => {
    setCameraError("");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Webcam access is restricted or not supported in this frame environment.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Camera startup error:", err);
      setCameraError(err.message || "Failed to start camera. Please verify device permissions or use manual uploader.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64Data = canvas.toDataURL("image/jpeg", 0.85);
        setImagePreview(base64Data);
        analyzeImage(base64Data);
      }
    } catch (err) {
      console.error("Failed to capture snapshot:", err);
      setCameraError("Failed to freeze frame. Please try again or use file uploading.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Result = reader.result as string;
      setImagePreview(base64Result);
      analyzeImage(base64Result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Image: string) => {
    setLoading(true);
    onAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          mode: selectedMode,
          language: selectedLanguage
        })
      });

      if (!response.ok) {
        const errPayload = await response.json().catch(() => ({}));
        throw new Error(errPayload.error || "Vision analysis failed. Verify API configuration.");
      }

      const parsedResult: VisionAnalysisResult = await response.json();
      onAnalysisResult(parsedResult);
    } catch (err: any) {
      console.error("Camera analysis failure:", err);
      setCameraError(err.message || "An unexpected error occurred during multimodal analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border-4 border-neutral-700 rounded-[2.5rem] p-8 flex flex-col gap-6" id="webcam-hardware-module">
      {/* Title */}
      <div>
        <h3 className="text-2xl font-black text-white tracking-wide uppercase flex items-center gap-2">
          <Camera className="w-6 h-6 text-yellow-400" />
          Real-world Image Analyzer (Webcam or File)
        </h3>
        <p className="text-neutral-400 font-bold text-base mt-2">
          Take a live snapshot or upload any photo to run modern server-side multimodal Gemini recognition.
        </p>
      </div>

      {/* Main View Area */}
      <div className="relative aspect-video rounded-[2rem] bg-black overflow-hidden border-4 border-neutral-800 flex items-center justify-center min-h-[240px]">
        
        {/* Live Camera View */}
        {cameraActive && !imagePreview && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            id="accessibility-live-stream"
          />
        )}

        {/* Frozen Preview image */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Captured Environment Preview"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Idle Blank State */}
        {!cameraActive && !imagePreview && (
          <div className="text-center p-6 flex flex-col items-center gap-4">
            <div className="p-6 rounded-3xl bg-neutral-800 text-neutral-500">
              <Eye className="w-16 h-16" />
            </div>
            <div>
              <p className="text-white font-black text-2xl">CAMERA LENS CLOSED</p>
              <p className="text-neutral-500 text-sm font-bold max-w-sm mt-2 uppercase tracking-wide">
                Start your camera stream to take live accessibility readings. If camera is blocked, you can upload file photos directly below.
              </p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <RefreshCw className="w-16 h-16 text-yellow-400 animate-spin mb-4" />
            <p className="text-yellow-400 font-black text-3xl uppercase tracking-widest animate-pulse">
              Gemini AI is Reasoning
            </p>
            <p className="text-neutral-300 text-lg font-bold mt-2 max-w-md uppercase tracking-wider">
              {loadingMessage}
            </p>
          </div>
        )}
      </div>

      {/* Critical Warnings / Error log */}
      {cameraError && (
        <div className="bg-red-950 border-4 border-red-500 text-red-100 p-5 rounded-2xl flex items-start gap-4" id="camera-issue-prompt">
          <AlertCircle className="w-7 h-7 text-red-500 shrink-0 mt-0.5 animate-bounce" />
          <div>
            <p className="font-extrabold text-lg uppercase text-red-500">System Notice</p>
            <p className="text-base font-bold text-red-200 mt-1">{cameraError}</p>
          </div>
        </div>
      )}

      {/* Trigger Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Camera stream togglers */}
        {!cameraActive ? (
          <button
            onClick={startCamera}
            disabled={loading}
            className="px-6 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-lg rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-102 active:scale-95 disabled:opacity-50 cursor-pointer"
            id="btn-lens-init"
          >
            <Camera className="w-5 h-5 fill-current" />
            START LIGHT CAMERA
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={captureSnapshot}
              disabled={loading}
              className="flex-1 px-4 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-base rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-102 active:scale-95 cursor-pointer"
              id="btn-lens-snap"
            >
              <Sparkles className="w-5 h-5" />
              SNAP & ANALYZE
            </button>
            <button
              onClick={stopCamera}
              disabled={loading}
              className="px-4 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-extrabold text-base rounded-2xl cursor-pointer"
              id="btn-lens-stop"
            >
              SHUT
            </button>
          </div>
        )}

        {/* Offline Upload fallbacks */}
        <div className="relative">
          <label
            htmlFor="file-upload-snap"
            className="px-6 py-4 bg-black hover:bg-neutral-950 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-102 active:scale-95 cursor-pointer border-4 border-neutral-700 static text-center"
            id="label-upl-control"
          >
            <Upload className="w-5 h-5" />
            UPLOAD PHOTO FILE
          </label>
          <input
            id="file-upload-snap"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={loading}
            className="hidden"
          />
        </div>
      </div>

      {/* Clear Snapshot resets */}
      {imagePreview && (
        <button
          onClick={() => {
            setImagePreview(null);
            onAnalysisResult(null);
            setCameraError("");
            if (cameraActive) {
              startCamera();
            }
          }}
          className="w-full py-3 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-bold text-sm rounded-xl uppercase tracking-widest transition-colors cursor-pointer"
          id="btn-reset-preview"
        >
          Clear Photo / Resume Stream
        </button>
      )}
    </div>
  );
}
