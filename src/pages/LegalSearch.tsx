import { useState } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchLegal } from "@/services/ml";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/AppLayout";

const LegalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const res: any = await searchLegal(query);
      setResults(res.data);
      toast({ title: "Search complete", description: `${res.data.length} results found` });
    } catch {
      toast({ title: "Error", description: "Search failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <SearchIcon className="h-8 w-8 text-accent" /> Legal Search
          </h1>
          <p className="text-muted-foreground mt-2">Search through legal databases, case laws, and statutes.</p>
        </div>

        <Card className="mb-8 border-border">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Search for laws, acts, case studies..." className="pl-10 h-12 text-base" />
              </div>
              <Button onClick={handleSearch} disabled={loading || !query.trim()} className="bg-accent text-accent-foreground hover:bg-gold-light h-12 px-8">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading && [1,2,3].map(i => (
            <Card key={i} className="border-border"><CardContent className="p-6"><div className="space-y-3"><div className="h-5 w-1/3 bg-muted rounded animate-pulse" /><div className="h-4 w-2/3 bg-muted rounded animate-pulse" /></div></CardContent></Card>
          ))}
          {results.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border-border hover:border-accent/30 transition-colors cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{r.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1 group-hover:text-accent transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default LegalSearch;
