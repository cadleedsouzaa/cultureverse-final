import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Send, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/components/ui/use-toast";

interface RecorderProps {
  artId?: string;
}

const OralHistoryRecorder = ({ artId = "general" }: RecorderProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Use useRef to keep the recognition instance stable across renders
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true; // Keep listening even if user pauses
      recognition.interimResults = true; // Show text while speaking
      recognition.lang = 'en-IN'; // English (India)

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setTranscript(finalTranscript);
        setError(null);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Error:", event.error);
        if (event.error === 'not-allowed') {
            setError("Microphone access denied. Please allow permission.");
            setIsRecording(false);
        }
        if (event.error === 'no-speech') {
            // Ignore "no speech" errors, just keep listening
            return; 
        }
      };

      recognition.onend = () => {
        // Only update state if we actually wanted to stop
        // This prevents random disconnections
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setError("Browser not supported. Try Chrome/Edge.");
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
        toast({ variant: "destructive", title: "Error", description: "Speech recognition not ready." });
        return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      setError(null);
      try {
          recognitionRef.current.start();
          setIsRecording(true);
      } catch (e) {
          // Sometimes it throws if already started, just ignore
          console.log("Mic already active");
          setIsRecording(true);
      }
    }
  };

  const handleSubmit = () => {
    if (!transcript) return;

    const newStory = {
      id: Date.now(),
      artId: artId, 
      text: transcript,
      date: new Date().toLocaleDateString(),
      title: `Oral History`
    };

    try {
      const existingData = localStorage.getItem("oral_histories");
      const stories = existingData ? JSON.parse(existingData) : [];
      const updatedStories = [newStory, ...stories];
     
      localStorage.setItem("oral_histories", JSON.stringify(updatedStories));
     
      toast({ title: "Story Archived", description: "Your oral history has been saved." });
      setTranscript("");
      
      // Stop recording on submit
      if (isRecording) {
          recognitionRef.current.stop();
          setIsRecording(false);
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  return (
    <div className="w-full bg-card/50 border border-border rounded-xl p-4 mt-6 shadow-sm">
       <h3 className="text-foreground font-bold text-sm mb-3 flex items-center gap-2">
        {isRecording && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
        <FileText className="w-4 h-4 text-primary" />
        Record Oral History
      </h3>

      <div className="flex flex-col gap-3">
        <Textarea
          className="w-full bg-background border-border min-h-[80px] text-sm focus:ring-primary"
          value={transcript}
          readOnly
          placeholder={error ? error : (isRecording ? "Listening... (Speak now)" : "Tap microphone to describe a memory or story about this craft...")}
        />

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={toggleRecording}
            className={`rounded-full font-bold text-xs transition-all ${
              isRecording ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isRecording ? <><Square size={14} className="mr-2"/> Stop Recording</> : <><Mic size={14} className="mr-2"/> Start Recording</>}
          </Button>
         
          {transcript && !isRecording && (
             <Button
                size="sm"
                variant="ghost"
                onClick={handleSubmit}
                className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 ml-auto text-xs font-bold"
             >
               <Send size={12} className="mr-1" /> Submit to Archive
             </Button>
          )}
        </div>
        
        {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
      </div>
    </div>
  );
};

export default OralHistoryRecorder;