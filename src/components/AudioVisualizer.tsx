
import React, { useRef, useEffect } from "react";

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  color: string;
  height?: number;
  width?: number;
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioElement,
  color,
  height = 40,
  width = 100,
  isPlaying
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  
  // Initialize audio analyser
  useEffect(() => {
    if (!audioElement) return;
    
    // Clean up previous context if exists
    if (audioContextRef.current) {
      analyserRef.current = null;
      sourceRef.current = null;
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    // Create new audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;
    
    // Create analyser node
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    
    // Create source from audio element
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    sourceRef.current = source;
    
    return () => {
      if (audioContextRef.current) {
        sourceRef.current?.disconnect();
        analyserRef.current?.disconnect();
        audioContextRef.current.close();
      }
    };
  }, [audioElement]);
  
  // Draw visualizer
  useEffect(() => {
    if (!canvasRef.current || !analyserRef.current || !isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    canvas.width = width;
    canvas.height = height;
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the visualization
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        // Using only part of the frequency range for better visualization
        if (i > bufferLength / 4) continue;
        
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        ctx.fillStyle = color;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, height, width, isPlaying]);
  
  // Generate placeholder bars when no audio is playing
  useEffect(() => {
    if (!canvasRef.current || isPlaying) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw placeholder bars
    const barCount = 5;
    const barWidth = 4;
    const barGap = 2;
    const totalWidth = barCount * barWidth + (barCount - 1) * barGap;
    const startX = (canvas.width - totalWidth) / 2;
    
    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.random() * (height / 3) + (height / 3);
      ctx.fillStyle = color;
      ctx.fillRect(
        startX + i * (barWidth + barGap), 
        canvas.height - barHeight, 
        barWidth, 
        barHeight
      );
    }
  }, [color, height, width, isPlaying]);
  
  return (
    <canvas
      ref={canvasRef}
      height={height}
      width={width}
      className="audio-visualizer"
    />
  );
};

export default AudioVisualizer;
