import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, LinkIcon, Clock, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/AppLayout";
import ReactMarkdown from "react-markdown";

// 🚀 Asli API import
import { apiRequest } from "../services/api";

const WebSummarizer = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      // 🚀 Asli Backend API call
      const res = await apiRequest<any>("/rag/summarize-web", {
        method: "POST",
        body: JSON.stringify({ url }),
      });

      // Postman ke hisaab se text 'res.data.data' ke andar hai
      const summaryText = res?.data?.data || res?.data || res?.answer || "No summary generated.";

      // Frontend UI ke liye automatically words aur time calculate karo
      const wordCount = summaryText.split(/\s+/).filter((w: string) => w.length > 0).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

      // Result ko UI ke format mein set karo
      setResult({
        summary: summaryText,
        word_count: wordCount,
        reading_time: readingTime
      });

      toast({ title: "Summary ready!", description: "Article has been summarized." });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to summarize. Check console.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Globe className="h-8 w-8 text-accent" /> Web Summarizer
          </h1>
          <p className="text-muted-foreground mt-2">Paste a URL to get an AI-powered summary of any legal article or webpage.</p>
        </div>

        <Card className="mb-8 border-border">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSummarize()} placeholder="https://www.law.cornell.edu/wex/affidavit" className="pl-10 h-12 text-base" />
              </div>
              <Button onClick={handleSummarize} disabled={loading || !url.trim()} className="bg-accent text-accent-foreground hover:bg-gold-light h-12 px-8">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Summarize"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Card className="border-border overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <Globe className="h-12 w-12 text-accent animate-pulse" />
                    <div className="absolute -inset-4 rounded-full border-2 border-accent/30 animate-ping" />
                  </div>
                  <p className="text-muted-foreground font-medium">Scanning and analyzing content...</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display">Summary</CardTitle>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{result.word_count} words</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{result.reading_time}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* 🚀 FIXED BUBBLE UI FOR PROPER RENDERING */}
                <div className="prose prose-sm max-w-none dark:prose-invert break-words whitespace-pre-wrap [&_strong]:text-foreground [&_p]:text-foreground/90 [&_h3]:text-foreground [&_h4]:text-foreground">
                  <ReactMarkdown>{result.summary}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default WebSummarizer;