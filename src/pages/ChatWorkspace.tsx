import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Bot, User, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "../services/api";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/AppLayout";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatWorkspace = () => {
  const [tab, setTab] = useState("vakil");
  const [vakilMessages, setVakilMessages] = useState<Message[]>([]);
  const [ragMessages, setRagMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const messages = tab === "vakil" ? vakilMessages : ragMessages;
  const setMessages = tab === "vakil" ? setVakilMessages : setRagMessages;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [vakilMessages, ragMessages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    
    // User ka message UI mein add karo
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);
    
    try {
      let answerText = "";
      
      if (tab === "vakil") {
        // 🚀 VAKIL SAHAB (ML Backend)
        const res = await apiRequest<any>("/ml/ask-vakil", {
          method: "POST",
          body: JSON.stringify({ user_query: q, k: 5 }), // k: 5 bhi bhej diya jaise Postman mein tha
        });
        
        console.log("🟢 VAKIL RESPONSE:", res); 
        
        // STRICT PARSING
        if (res && typeof res.data === 'string') {
            answerText = res.data;
        } else if (res?.data?.answer) {
            answerText = res.data.answer;
        } else if (res?.answer) {
            answerText = res.answer;
        } else {
            answerText = "Could not parse the response correctly.";
        }
        
      } else {
        // 🚀 RAG ASSISTANT (Multi-Rag Backend)
        const res = await apiRequest<any>("/rag/chat", {
          method: "POST",
          body: JSON.stringify({ message: q }), 
        });
        
        console.log("🟢 RAG RESPONSE:", res);
        
        if (res && typeof res.data === 'string') {
            answerText = res.data;
        } else if (res?.data?.answer) {
            answerText = res.data.answer;
        } else if (res?.answer) {
            answerText = res.answer;
        } else {
            answerText = "Could not parse the response correctly.";
        }
      }

      // AI ka text UI mein add karo
      setMessages((prev) => [...prev, { role: "assistant", content: answerText }]);
      
    } catch (error: any) {
      console.error("Chat Error:", error);
      toast({ 
        title: "Connection Error", 
        description: "Failed to connect to the AI model. Check console for details.", 
        variant: "destructive" 
      });
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Sorry, I encountered an error connecting to the server." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-10rem)]">
        <div className="mb-4">
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-accent" /> AI Legal Workspace
          </h1>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="h-[calc(100%-3rem)]">
          <TabsList className="mb-4">
            <TabsTrigger value="vakil" className="gap-2"><Bot className="h-4 w-4" />Vakil Sahab</TabsTrigger>
            <TabsTrigger value="rag" className="gap-2"><MessageSquare className="h-4 w-4" />RAG Assistant</TabsTrigger>
          </TabsList>

          {["vakil", "rag"].map((t) => (
            <TabsContent key={t} value={t} className="h-[calc(100%-3rem)] mt-0">
              <Card className="h-full flex flex-col border-border">
                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <div ref={t === tab ? scrollRef : undefined} className="flex-1 overflow-y-auto p-6 space-y-4">
                    {(t === "vakil" ? vakilMessages : ragMessages).length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Bot className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">{t === "vakil" ? "Ask Vakil Sahab anything about law" : "Chat with your uploaded documents"}</p>
                        <p className="text-sm mt-1">{t === "vakil" ? "General legal questions, articles, case law" : "Upload documents first, then ask questions"}</p>
                      </div>
                    )}
                    {(t === "vakil" ? vakilMessages : ragMessages).map((msg, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                        {msg.role === "assistant" && <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0"><Bot className="h-4 w-4 text-accent" /></div>}
                        
                        {/* 🚀 FIXED BUBBLE UI HERE */}
                        <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm shadow-sm ${msg.role === "user" ? "bg-accent text-accent-foreground rounded-br-sm ml-auto" : "bg-muted text-foreground rounded-bl-sm mr-auto border border-border/50"}`}>
                          {msg.role === "assistant" ? (
                            <div className="prose prose-sm max-w-none break-words whitespace-pre-wrap dark:prose-invert [&_strong]:text-foreground [&_p]:text-foreground/90 [&_p]:last:mb-0 [&_ul]:my-2 [&_li]:my-0">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <div className="break-words whitespace-pre-wrap">{msg.content}</div>
                          )}
                        </div>

                        {msg.role === "user" && <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0"><User className="h-4 w-4 text-primary-foreground" /></div>}
                      </motion.div>
                    ))}
                    {loading && tab === t && (
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center"><Bot className="h-4 w-4 text-accent" /></div>
                        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-accent" />
                          <span className="text-xs text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={t === "vakil" ? "Ask a legal question..." : "Ask about your documents..."} className="flex-1" />
                      <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-accent text-accent-foreground hover:bg-gold-light">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </AppLayout>
  );
};

export default ChatWorkspace;