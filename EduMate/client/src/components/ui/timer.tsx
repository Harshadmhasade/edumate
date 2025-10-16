import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, SkipForward } from "lucide-react";

interface TimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
}

export function Timer({ duration, onComplete, onPause, onResume, onStop }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
    if (isPaused) {
      onResume?.();
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
    onPause?.();
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration);
    onStop?.();
  };

  const handleSkip = () => {
    setTimeLeft(0);
    setIsRunning(false);
    onComplete?.();
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-32 h-32 bg-primary/10 rounded-full mb-4">
        <div className="text-3xl font-bold text-primary" data-testid="text-timer-display">
          {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 mb-6">
        {!isRunning ? (
          <Button 
            className="px-8"
            onClick={handleStart}
            data-testid="button-timer-start"
          >
            <Play className="w-4 h-4 mr-2" />
            {isPaused ? "Resume" : "Start"}
          </Button>
        ) : (
          <Button 
            variant="outline"
            onClick={handlePause}
            data-testid="button-timer-pause"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        )}
        
        <Button 
          variant="outline"
          onClick={handleStop}
          data-testid="button-timer-stop"
        >
          <Square className="w-4 h-4 mr-2" />
          Stop
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleSkip}
          data-testid="button-timer-skip"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Skip
        </Button>
      </div>
      
      {/* Progress bar */}
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">Session Progress</span>
          <span className="text-sm font-medium text-slate-900">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
