import React, { useState, useEffect } from 'react';
import { Volume2, Square, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from "@/components/ui/use-toast";

// Map Google Translate codes to Browser Speech Locales
const LOCALE_MAP: Record<string, string> = {
  'en': 'en-US',
  'hi': 'hi-IN',
  'kn': 'kn-IN',
  'ta': 'ta-IN',
  'te': 'te-IN',
  'mr': 'mr-IN',
  'bn': 'bn-IN',
  'gu': 'gu-IN',
  'ml': 'ml-IN',
  'ur': 'ur-IN',
  'pa': 'pa-IN',
  'ja': 'ja-JP',
  'fr': 'fr-FR',
  'es': 'es-ES',
  'de': 'de-DE',
};

export const TextToSpeech = () => {
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSupported(true);
      
      // Load voices (Chrome loads them asynchronously)
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const getTargetLanguage = () => {
    const match = document.cookie.match(new RegExp('(^| )googtrans=([^;]+)'));
    if (match) {
      // e.g. "/en/hi" -> "hi"
      return match[2].split('/')[2]; 
    }
    return 'en'; 
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // 1. Get Text
    const title = document.getElementById('tts-title')?.innerText || "";
    const desc = document.getElementById('tts-desc')?.innerText || "";
    // Clean up Google Translate artifacts (optional)
    const textToRead = `${title}. ${desc}`.replace(/\n/g, ' ');

    if (!textToRead.trim()) return;

    // 2. Determine Language
    const shortLang = getTargetLanguage(); // 'hi'
    const fullLang = LOCALE_MAP[shortLang] || shortLang; // 'hi-IN'

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = fullLang;
    utterance.rate = 0.9;

    // 3. Find the BEST voice for this language
    // This is crucial. If we don't set a specific voice, browsers often fail on non-English.
    if (voices.length > 0) {
        const matchingVoice = voices.find(v => v.lang === fullLang) || 
                              voices.find(v => v.lang.startsWith(shortLang));
        
        if (matchingVoice) {
            utterance.voice = matchingVoice;
            console.log("Using voice:", matchingVoice.name);
        } else {
            // Fallback: If browser doesn't have Hindi voice installed
            if (shortLang !== 'en') {
                toast({
                    variant: "destructive",
                    title: "Voice Not Available",
                    description: `Your browser doesn't have a voice pack installed for this language (${fullLang}).`,
                });
                // Try to speak anyway, some browsers might auto-download
            }
        }
    }

    // 4. Handle Events
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
        console.error("TTS Error", e);
        setIsSpeaking(false);
    };

    // 5. Speak
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking if user leaves page
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!supported) return null;

  return (
    <Button
      onClick={handleSpeak}
      variant={isSpeaking ? "destructive" : "secondary"}
      size="icon"
      className={`rounded-full w-12 h-12 shadow-lg transition-all duration-300 flex-shrink-0 ${
        isSpeaking ? "animate-pulse ring-2 ring-red-400" : "hover:bg-primary hover:text-primary-foreground"
      }`}
      title="Read Aloud"
    >
      {isSpeaking ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-6 h-6" />}
    </Button>
  );
};