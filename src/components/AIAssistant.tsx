import React, { useState, useRef, useEffect } from 'react';
import { AIAssistantMessage } from '../types';
import { 
  Sparkles, Send, Bot, User, Trash2, ArrowRight, Zap, 
  CornerDownRight, RefreshCw, X, ShieldAlert, Activity, BarChart3, Clock,
  Mic, MicOff, Volume2, VolumeX, Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantProps {
  onClose?: () => void;
  onApplyReroute?: (suggestion: string) => void;
  theme?: 'light' | 'dark';
}

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', locale: 'en-US' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు (Telugu)', locale: 'te-IN' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी (Hindi)', locale: 'hi-IN' },
  { code: 'ur', name: 'Urdu', native: 'اردو (Urdu)', locale: 'ur-PK' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ் (Tamil)', locale: 'ta-IN' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം (Malayalam)', locale: 'ml-IN' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ (Kannada)', locale: 'kn-IN' }
];

// Browser speech recognition support
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function AIAssistant({ onClose, onApplyReroute, theme }: AIAssistantProps) {
  // In this app, standard mode (theme === 'light') has a dark cockpit layout,
  // and dark mode (theme === 'dark', with .dark class) has a light cockpit layout.
  const isLightCockpit = theme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  // English is default language
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return localStorage.getItem('tp_language') || 'en';
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('tp_ai_muted') === 'true';
  });

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const speakCancelRef = useRef<boolean>(false);

  // Initialize welcome prompts localized based on language
  const getWelcomeMessageText = (lang: string) => {
    switch(lang) {
      case 'te': 
        return "### ట్రిప్ పైలట్ ప్రో AI ఆపరేషన్స్ కమాండ్‌కు స్వాగతం!\nనేను మీ ప్రత్యక్ష లాజిస్టిక్స్ కోపైలట్‌ను. నేను సక్రియ నివేదికలు, ఫ్లీట్ ఛార్జీలు మరియు వాతావరణ పారామితులలో సమాచారాన్ని కలిగి ఉన్నాను.\n\nనేను సహాయం చేయగల కొన్ని అంశాలు ఇక్కడ ఉన్నాయి:";
      case 'hi':
        return "### ट्रिपपायलट प्रो AI ऑपरेशंस कमांड में आपका स्वागत है!\nमैं आपका लाइव लॉजिस्टिक्स सह-पायलट हूँ। मैं सक्रिय प्रेषण फोल्डर, बेड़े के शुल्क और मौसम के मानकों में पूरी तरह से जमीनी जानकारी रखता हूँ।\n\nयहाँ कुछ ऑपरेशन आइटम दिए गए हैं जिनके साथ मैं आज आपकी सहायता कर सकता हूँ:";
      case 'ur':
        return "### ٹرپ پائلٹ پرو AI آپریشنز کمانڈ میں آپ کا استقبال ہے!\nمیں آپ کا لائیو لاجسٹکس کو پائلٹ ہوں۔ میں فعال ڈسپیچ فولڈرز، فلیٹ چارجز، اور موسمی پیرامیٹرز پر مکمل معلومات رکھتا ہوں۔\n\nیہاں کچھ آپریشنز آئٹمز ہیں جن میں میں آج آپ کی مدد کر سکتا ہوں:";
      case 'ta':
        return "### டிரிப் பைலட் ப்ரோ AI செயல்பாட்டுக் கட்டளைக்கு உங்களை வரவேற்கிறோம்!\nநான் உங்கள் நேரடி தளவாட துணை பைலட். செயலில் உள்ள அனுப்பும் கோப்புறைகள், வாகனக் கட்டணங்கள் மற்றும் வானிலை அளவுருக்களில் நான் முழுமையாக கவனம் செலுத்துகிறேன்.\n\nஇன்று நான் உதவக்கூடிய சில செயல்பாட்டு உருப்படிகள் இதோ:";
      case 'ml':
        return "### ട്രിപ്പ് പൈലറ്റ് പ്രോ AI ഓപ്പറേഷൻസ് കമാൻഡിലേക്ക് സ്വാഗതം!\nഞാൻ നിങ്ങളുടെ തത്സമയ ലോജിസ്റ്റിക്സ് കോപൈലറ്റ് ആണ്. സജീവമായ ഡിസ്പാച്ച് ഫോൾഡറുകൾ, ഫ്ലീറ്റ് ചാർജുകൾ, കാലാവസ്ഥാ പാരാമീറ്ററുകൾ എന്നിവയിൽ ഞാൻ പൂർണ്ണമായും ശ്രദ്ധ കേന്ദ്രീകരിക്കുന്നു.\n\nഇന്ന് എനിക്ക് സഹായിക്കാൻ കഴിയുന്ന ചില പ്രവർത്തനങ്ങൾ ഇതാ:";
      case 'kn':
        return "### ಟ್ರಿಪ್ ಪೈಲಟ್ ಪ್ರೊ AI ಆಪರೇಷನ್ಸ್ ಕಮಾಂಡ್‌ಗೆ ಸುಸ್ವಾಗತ!\nನಾನು ನಿಮ್ಮ ಲೈವ್ ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಸಹ-ಪೈಲಟ್ ಜಿಪಿಎಸ್. ನಾನು ಸಕ್ರಿಯ ರವಾನೆ ಫೋಲ್ಡರ್‌ಗಳು, ಫ್ಲೀಟ್ ಚಾರ್ಜ್‌ಗಳು ಮತ್ತು ಹವಾಮಾನ ಪರಿಮಾಣದಲ್ಲಿ ಮಾಹಿತಿಯನ್ನು ಹೊಂದಿದ್ದೇನೆ.\n\nಇಂದು ನಾನು ಸಹಾಯ ಮಾಡಬಹುದಾದ ಕೆಲವು ಕಾರ್ಯಾಚರಣೆಯ ವಿಷಯಗಳು ಇಲ್ಲಿವೆ:";
      default:
        return "### Welcome to TripPilot Pro AI Operations Command!\nI am your live logistics copilot. I am fully grounded in active dispatch folders, fleet charges, and weather parameters.\n\nHere are some operations items I can assist with today:";
    }
  };

  const getWelcomeSuggestions = (lang: string) => {
    switch(lang) {
      case 'te': return ["I-495 ప్రమాదాలు అంచనా", "రోజువారీ సారాంశం సృష్టించు", "వర్క్‌లోడ్ బ్యాలెన్స్ వివరణ"];
      case 'hi': return ["I-495 पर देरी जोखिम प्रेषण", "दैनिक कार्यकारी सारांश बनाएँ", "रोस्टर कार्यभार संतुलन रिपोर्ट"];
      case 'ur': return ["I-495 پر تاخیر کے خطرات", "روزانہ کی ایگزیکٹو تفصیل بنائیں", "ڈرائیور کے کام کا بوجھ بیلنس رپورٹ"];
      case 'ta': return ["I-495 தாமத அபாயங்கள்", "தினசரி நிர்வாக சுருக்கம்", "ஓட்டுநர் பணிச்சுமை அறிக்கை"];
      case 'ml': return ["I-495 അപകടസാധ്യതകൾ", "ദിവസേനയുള്ള സംഗ്രഹം", "ഡ്രൈവർമാരുടെ ജോലിഭാരം"];
      case 'kn': return ["I-495 ವಿಳಂಬದ ಅಪಾಯಗಳು", "ದೈನಂದಿನ ಸಾರಾಂಶ ವರದಿ", "ಚಾಲಕರ ಕೆಲಸದ ಹೊರೆ ವರದಿ"];
      default: return ["Predict Delay Risks on I-495", "Generate Daily Executive Summary", "Explain Roster Workload Balances"];
    }
  };

  const [messages, setMessages] = useState<AIAssistantMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'ai',
      text: getWelcomeMessageText(localStorage.getItem('tp_language') || 'en'),
      timestamp: new Date().toISOString(),
      suggestions: getWelcomeSuggestions(localStorage.getItem('tp_language') || 'en')
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Synchronize initial speech synthesis stop
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update welcome message if language switches on empty chat
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome') {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: getWelcomeMessageText(selectedLanguage),
          timestamp: new Date().toISOString(),
          suggestions: getWelcomeSuggestions(selectedLanguage)
        }
      ]);
    }
  }, [selectedLanguage]);

  // Setup Dictation Speech Recognition
  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;

      const matchedLang = LANGUAGES.find(l => l.code === selectedLanguage);
      rec.lang = matchedLang ? matchedLang.locale : 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        if (resultText) {
          setInputText(prev => (prev ? prev + " " : "") + resultText);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsRecording(false);
        if (event.error === 'aborted') {
          // 'aborted' is a standard cancellation (e.g. stopped manually or lost focus) - no error should be displayed.
          return;
        }
        if (event.error === 'not-allowed') {
          setSpeechError("Microphone permission was blocked or denied. Please grant microphone privileges in browser site settings, or open this application in a standalone browser tab.");
        } else if (event.error === 'service-not-allowed') {
          setSpeechError("The Speech Recognition service is restricted by your browser inside this preview frame. To resolve this, open the application in its own standalone browser tab by clicking the 'Open' icon in the top header.");
        } else if (event.error === 'no-speech') {
          setSpeechError("No voice input was detected. Try speaking closer to your microphone.");
        } else {
          setSpeechError(`Voice input error: ${event.error}. Please check your default mic device configurations or use English.`);
        }
        setTimeout(() => setSpeechError(null), 12000);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [selectedLanguage]);

  // Handle Speech out (TTS)
  const speakResponseText = (textToSpeak: string) => {
    if (isMuted || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();

      // Clean markdown tags, hashtags for perfect voice reading
      let cleanText = textToSpeak
        .replace(/[#*`_~]/g, '')
        .replace(/\[Suggestion:[^\]]+\]/gi, '')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const matchedLang = LANGUAGES.find(l => l.code === selectedLanguage);
      utterance.lang = matchedLang ? matchedLang.locale : 'en-US';

      // Load matching voice
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.toLowerCase() === utterance.lang.toLowerCase());
      if (voice) {
        utterance.voice = voice;
      }
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("TextToSpeech Synthesis failed:", e);
    }
  };

  // Toggle Dictation Mic
  const handleToggleDictation = () => {
    if (!SpeechRecognition) {
      setSpeechError("Dictation is not supported in this browser window / active Frame. Please open the workspace in a dedicated browser tab.");
      setTimeout(() => setSpeechError(null), 12000);
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      try {
        if (recognitionRef.current) {
          const matchedLang = LANGUAGES.find(l => l.code === selectedLanguage);
          recognitionRef.current.lang = matchedLang ? matchedLang.locale : 'en-US';
          recognitionRef.current.start();
        }
      } catch (e) {
        console.error("Failed starting speech recognition model", e);
      }
    }
  };

  // Toggle sound mute option
  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('tp_ai_muted', newMuted ? 'true' : 'false');
    if (newMuted && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Auto scroll to bottom when message arrives
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop talking on typing new input
    }

    // Append User Message
    const userMsg: AIAssistantMessage = {
      id: "us-" + Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({ role: m.sender === 'ai' ? 'model' : 'user', text: m.text })),
          language: selectedLanguage
        })
      });
      const data = await response.json();
      
      // Parse suggestions out of brackets like [Suggestion: Brief Vanguard Group]
      const rawText = data.text || "Ops command report is currently unavailable.";
      const suggestions: string[] = [];
      const cleanedText = rawText.replace(/\[Suggestion:\s*([^\]]+)\]/g, (match: string, p1: string) => {
        suggestions.push(p1.trim());
        return '';
      });

      const aiMsg: AIAssistantMessage = {
        id: "ai-" + Math.random().toString(),
        sender: 'ai',
        text: cleanedText,
        timestamp: new Date().toISOString(),
        suggestions: suggestions.length > 0 ? suggestions : getWelcomeSuggestions(selectedLanguage)
      };

      setMessages(prev => [...prev, aiMsg]);

      // Speak back the response in the selected language
      speakResponseText(cleanedText);

    } catch (err) {
      console.error(err);
      const errMsg: AIAssistantMessage = {
        id: "ai-err",
        sender: 'ai',
        text: "Logistics alert! An interruption in my server telemetry tunnel occurred. Please retry your operations checkpoint query.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: getWelcomeMessageText(selectedLanguage),
        timestamp: new Date().toISOString(),
        suggestions: getWelcomeSuggestions(selectedLanguage)
      }
    ]);
  };

  // Change active language
  const handleSelectLanguage = (code: string) => {
    setSelectedLanguage(code);
    localStorage.setItem('tp_language', code);
    setIsLangMenuOpen(false);
    
    // Broadcast language switch to anyone listening (or custom events if needed)
    window.dispatchEvent(new CustomEvent('tp_language_changed', { detail: code }));
  };

  const activeLangName = LANGUAGES.find(l => l.code === selectedLanguage)?.native || "English";

  return (
    <div className="flex flex-col h-full bg-[#070b13]/98 dark:bg-zinc-50/98 backdrop-blur-3xl border-l border-zinc-800/40 dark:border-zinc-200/60 shadow-2xl rounded-l-3xl overflow-hidden font-sans relative">
      
      {/* Header section with sparkles & iOS 27 controller widgets */}
      <div className="p-5 border-b border-zinc-800/40 dark:border-zinc-200/50 bg-gradient-to-r from-[#10b981]/10 to-transparent flex flex-col gap-3">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#10b981]/15 border border-[#10b981]/25 rounded-2xl">
              <Sparkles className="h-5 w-5 text-[#10b981] animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 dark:text-zinc-850 flex items-center gap-1.5 leading-none">
                AI Command Copilot <span className="text-[9px] font-mono font-black bg-[#10b981]/15 dark:bg-[#059669]/10 px-1.5 py-0.5 rounded text-[#10b981] dark:text-[#059669]">GEMINI</span>
              </h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 leading-none">Live multi-lingual speech copilot.</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Audio Mute Speak Switcher */}
            <button
              id="ai-speech-mute-btn"
              onClick={handleToggleMute}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                isMuted 
                  ? 'border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10' 
                  : 'border-[#10b981]/20 bg-[#10b981]/5 text-[#10b981] hover:bg-[#10b981]/10'
              }`}
              title={isMuted ? "Unmute AI Spoken Output" : "Mute AI Spoken Output"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <button 
              id="clear-ai-history-btn"
              onClick={handleClearHistory}
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-zinc-800/50 dark:hover:bg-zinc-200/80 transition-colors border border-transparent cursor-pointer"
              title="Clear Command History"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            {onClose && (
              <button 
                id="close-ai-assistant-btn"
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:bg-zinc-800/50 dark:hover:bg-zinc-200/80 transition-colors border border-transparent cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic iOS 27 Liquid Glass Language Selector dropdown banner */}
        <div className="relative pt-1">
          <button
            id="ai-language-dropdown-toggle"
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-zinc-900/40 dark:bg-zinc-200/30 border border-zinc-800/80 dark:border-zinc-300 hover:border-[#10b981]/40 text-xs font-bold text-zinc-200 dark:text-zinc-850 transition-all cursor-pointer hover:bg-zinc-900 dark:hover:bg-zinc-150"
          >
            <div className="flex items-center gap-2">
              <Languages className="h-3.5 w-3.5 text-[#10b981]" />
              <span>Language: <span className="text-[#10b981] dark:text-[#059669] font-extrabold">{activeLangName}</span></span>
            </div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-450">▼</span>
          </button>

          <AnimatePresence>
            {isLangMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsLangMenuOpen(false)} />
                <motion.div
                  id="ai-language-dropdown-menu"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 mt-1.5 z-20 rounded-2xl bg-[#0a0f1d] dark:bg-zinc-50 shadow-2xl p-2.5 overflow-hidden font-sans border border-zinc-800 dark:border-zinc-200 space-y-1 max-h-60 overflow-y-auto"
                >
                  <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest px-2.5 py-1">SELECT PREFERRED LANGUAGE</p>
                  {LANGUAGES.map((lang) => {
                    const isSelected = selectedLanguage === lang.code;
                    return (
                      <button
                        id={`lang-preset-${lang.code}`}
                        key={lang.code}
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all border ${
                          isSelected 
                            ? 'bg-[#10b981]/15 dark:bg-[#059669]/10 border-[#10b981]/30 dark:border-[#059669]/25 text-[#10b981] dark:text-[#059669] font-extrabold' 
                            : 'hover:bg-zinc-900 dark:hover:bg-zinc-150 border-transparent text-zinc-400 dark:text-zinc-650'
                        }`}
                      >
                        <span className="text-xs">{lang.native}</span>
                        {isSelected && <span className="text-[10px] text-[#10b981] h-2 w-2 rounded-full bg-[#10b981] inline-block animate-pulse" />}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Messages area with beautiful layout */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
        {messages.map((m) => {
          const isAI = m.sender === 'ai';
          return (
            <div key={m.id} className={`flex items-start gap-3 ${!isAI ? 'flex-row-reverse' : ''}`}>
              {/* Profile Avatar bubble */}
              <div className={`p-2 rounded-2xl shrink-0 border ${
                isAI 
                  ? 'bg-[#10b981]/15 border-[#10b981]/25 text-[#10b981] animate-pulse' 
                  : 'bg-zinc-800/40 dark:bg-zinc-100/80 border-zinc-700/35 dark:border-zinc-300 text-zinc-200 dark:text-zinc-800 shadow-sm'
              }`}>
                {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              {/* Text Bubble */}
              <div className="space-y-3 max-w-[85%]">
                <div className={`rounded-2xl p-4 border leading-relaxed font-sans shadow-sm ${
                  isAI 
                    ? 'bg-zinc-900/50 dark:bg-zinc-100 border-zinc-800 dark:border-zinc-250 text-zinc-100 dark:text-zinc-850' 
                    : 'bg-indigo-600 text-zinc-50 border-indigo-650 dark:bg-indigo-600 dark:text-zinc-50 dark:border-indigo-600 text-sm shadow-md'
                }`}>
                  <p className="whitespace-pre-line font-medium text-sm font-sans" style={{ color: '#000000' }}>{m.text}</p>
                </div>

                {/* Interaction Suggestions chips */}
                {isAI && m.suggestions && m.suggestions.length > 0 && (
                  <div className="flex flex-col gap-1.5 pt-1 text-left">
                    <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-1 font-mono">Suggested Operational Queries</p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.suggestions.map((s, sIdx) => (
                        <button
                          id={`ai-suggestion-chip-${sIdx}`}
                          key={sIdx}
                          onClick={() => handleSendMessage(s)}
                          className="px-3 py-1.5 text-xs font-semibold text-[#10b981] dark:text-[#059669] hover:text-[#059669] dark:hover:text-[#047857] bg-[#10b981]/10 dark:bg-[#059669]/5 hover:bg-[#10b981]/20 dark:hover:bg-[#059669]/15 rounded-xl border border-[#10b981]/20 dark:border-[#059669]/20 text-left flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <CornerDownRight className="h-3 w-3 shrink-0" /> {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading / Writing Bubble */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-2xl bg-[#10b981]/15 border border-[#10b981]/20 text-[#10b981] shrink-0 animate-pulse">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl p-4 bg-zinc-900/40 dark:bg-zinc-100/60 border border-zinc-800 dark:border-zinc-250 flex items-center gap-2.5">
              <RefreshCw className="h-3.5 w-3.5 text-[#10b981] animate-spin" />
              <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-650">Synthesizing logistics telemetry logs...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input container */}
      <div className="p-4 border-t border-zinc-800/40 dark:border-zinc-200/50 bg-[#070b13]/90 dark:bg-zinc-50/90 backdrop-blur-md relative z-10 animate-fade-in">
        <AnimatePresence>
          {speechError && (
            <motion.div
              id="speech-error-notif"
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
              className="mb-3 p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 text-xs text-amber-500 dark:text-amber-700 flex items-start gap-2 font-medium overflow-hidden"
            >
              <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1 flex flex-col gap-1">
                <span>{speechError}</span>
                {(speechError.includes("restricted") || speechError.includes("blocked") || speechError.includes("denied") || speechError.includes("service-not-allowed")) && (
                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-600 dark:text-[#059669] hover:underline pt-1 w-fit"
                  >
                    <span>Open in Standalone Tab ↗</span>
                  </a>
                )}
              </div>
              <button
                id="dismiss-speech-error-btn"
                onClick={() => setSpeechError(null)}
                className="text-[10px] uppercase font-bold text-zinc-400 hover:text-zinc-650 cursor-pointer px-1"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex items-center gap-2">
          
          {/* Mic Dictation trigger button with fluid tracking pulse */}
          <button
            id="ai-copilot-dictation-btn"
            type="button"
            onClick={handleToggleDictation}
            className={`p-3 rounded-2xl border transition-all cursor-pointer relative shrink-0 ${
              isRecording 
                ? 'bg-rose-500/20 border-rose-500 text-rose-550 shadow-lg shadow-rose-500/10 animate-pulse scale-105' 
                : 'bg-zinc-900 dark:bg-zinc-100 border-zinc-800 dark:border-zinc-250 text-zinc-200 dark:text-zinc-805 hover:border-[#10b981]/40 shadow-inner'
            }`}
            title={isRecording ? "Listening... Speak now (tap to stop)" : "Trigger Voice Dictation"}
          >
            {isRecording ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
            {isRecording && (
              <span className="absolute -inset-1 rounded-2xl border border-rose-500/30 animate-ping" />
            )}
          </button>

          <div className="relative flex-1">
            <input 
              id="ai-copilot-input"
              type="text" 
              placeholder={isRecording ? "Listening... Speak clearly" : "Ask Copilot: Predict delay, balance fleet..."}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={loading}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputText)}
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] disabled:opacity-50 font-sans shadow-inner placeholder-zinc-500 dark:placeholder-zinc-400"
              style={{
                backgroundColor: isLightCockpit ? '#ffffff' : '#18181b',
                color: isLightCockpit ? '#111827' : '#f9fafb',
                borderColor: isLightCockpit ? '#d1d5db' : '#27272a',
                borderWidth: '1px'
              }}
            />
            <button
              id="ai-copilot-send-btn"
              onClick={() => handleSendMessage(inputText)}
              disabled={loading || !inputText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white disabled:opacity-30 disabled:hover:scale-100 transition-all cursor-pointer shadow-md glass-shine-btn"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-450 text-center mt-2.5 font-medium leading-normal">
          Grounded on active dispatch directories. Text-to-speech auto-responds inside safe terminal loops.
        </p>
      </div>
    </div>
  );
}
