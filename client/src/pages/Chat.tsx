import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Loader2, Lightbulb, Calculator, Cpu, Package } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useRef, useEffect } from "react";
import { Streamdown } from "streamdown";
import { nanoid } from "nanoid";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  { icon: Calculator, text: "Bill eka 25,000i. Mata mokak da ගැලපෙන්නේ?", label: "System Size" },
  { icon: Cpu, text: "Growatt inverters hodaida?", label: "Hardware" },
  { icon: Package, text: "On-grid vs Off-grid - mokakda වෙනස?", label: "System Types" },
  { icon: Lightbulb, text: "Net metering ක්‍රියා කරන්නේ කොහොමද?", label: "Net Metering" },
];

export default function Chat() {
  const [sessionId] = useState(() => nanoid());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMutation = trpc.chat.send.useMutation({
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: nanoid(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    },
    onError: () => {
      setMessages(prev => [...prev, {
        id: nanoid(),
        role: 'assistant',
        content: 'සමාවන්න, දෝෂයක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.',
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    },
  });

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: nanoid(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }]);

    setInput('');
    
    // Send to API
    sendMutation.mutate({
      message: messageText,
      sessionId,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 container py-6 flex flex-col max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            <Bot className="w-4 h-4" />
            <span>AI උපදේශක</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Solar Expert Chat
          </h1>
          <p className="text-muted-foreground">
            Electrical Engineer persona සමඟ ඔබේ solar ප්‍රශ්න අහන්න
          </p>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-full solar-gradient flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium">Solar Expert</div>
                <div className="text-xs text-muted-foreground font-normal">
                  Electrical Engineer • Online
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="w-16 h-16 rounded-full solar-gradient-light flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">ආයුබෝවන්! 👋</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    මම ඔබේ Solar Expert. System sizing, Hardware quality, CEB tariffs 
                    ගැන ඕනෑම ප්‍රශ්නයක් අහන්න.
                  </p>
                  
                  {/* Suggested Questions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                    {suggestedQuestions.map((q, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="justify-start h-auto py-3 px-4 text-left"
                        onClick={() => handleSend(q.text)}
                      >
                        <q.icon className="w-4 h-4 mr-2 text-primary shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground">{q.label}</div>
                          <div className="text-sm truncate">{q.text}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full solar-gradient flex items-center justify-center shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-3 ${
                          message.role === 'user'
                            ? 'chat-bubble-user'
                            : 'chat-bubble-assistant'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <Streamdown className="text-sm prose prose-sm max-w-none">
                            {message.content}
                          </Streamdown>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                        <div className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleTimeString('si-LK', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full solar-gradient flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="chat-bubble-assistant px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="ඔබේ ප්‍රශ්නය මෙහි ටයිප් කරන්න..."
                  className="flex-1"
                  disabled={sendMutation.isPending}
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || sendMutation.isPending}
                  size="icon"
                >
                  {sendMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Technical terms English වලින් භාවිතා කරන්න (Inverter, Units, Grid, Warranty)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground">System Sizing</div>
            <div className="text-sm font-medium">"Bill eka X i"</div>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground">Hardware</div>
            <div className="text-sm font-medium">"X hodaida?"</div>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground">Comparison</div>
            <div className="text-sm font-medium">"X vs Y"</div>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground">ROI</div>
            <div className="text-sm font-medium">"ROI කීයද?"</div>
          </div>
        </div>
      </div>
    </div>
  );
}
