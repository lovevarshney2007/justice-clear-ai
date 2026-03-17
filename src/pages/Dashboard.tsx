import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, MessageSquare, Globe, Search, FileText, Activity, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getHealth } from "@/services/ml";
import { getChatStatus } from "@/services/rag";
import { getHistory } from "@/services/document";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/AppLayout";

const quickActions = [
  { to: "/case-predictor", label: "Case Predictor", description: "Predict case outcomes with AI", icon: Scale, color: "bg-accent/10 text-accent" },
  { to: "/chat", label: "AI Legal Chat", description: "Consult our legal AI assistants", icon: MessageSquare, color: "bg-teal/10 text-teal" },
  { to: "/summarizer", label: "Web Summarizer", description: "Summarize legal articles", icon: Globe, color: "bg-accent/10 text-accent" },
  { to: "/search", label: "Legal Search", description: "Search legal databases", icon: Search, color: "bg-teal/10 text-teal" },
  { to: "/documents", label: "Document Hub", description: "Analyze & manage legal docs", icon: FileText, color: "bg-accent/10 text-accent" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const Dashboard = () => {
  const { user } = useAuth();
  const [health, setHealth] = useState<string | null>(null);
  const [chatStatus, setChatStatus] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
useEffect(() => {
    getHealth().then((r: any) => setHealth(r.message));
    getChatStatus().then((r: any) => setChatStatus(r));
    getHistory().then((r: any) => {
      // 🚀 FIX: Backend ke data ko Frontend ke variables ke sath map karo aur 'failed' ko hata do
      const rawHistory = r.data || r;
      
      const formattedHistory = (Array.isArray(rawHistory) ? rawHistory : [])
        .filter((doc: any) => doc.status !== 'failed') // Failed documents ko hide kar diya
        .map((doc: any) => ({
          ...doc,
          filename: doc.originalFileName || doc.filename || "Untitled Document", // Naya naam
          date: new Date(doc.createdAt || doc.date || Date.now()).toLocaleDateString(), // Readable date format
          status: doc.status === 'completed' ? 'Processed' : doc.status,
          risk_level: doc.risk_level || "Analyzed"
        }));
        
      setHistory(formattedHistory);
    });
  }, []);

  return (
    <AppLayout>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-display font-bold text-foreground mb-2">
          Welcome back, <span className="text-accent">{user?.name}</span>
        </h1>
        <p className="text-muted-foreground text-lg">Your AI-powered legal workspace is ready.</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Badge variant="outline" className="gap-2 py-1.5 px-3">
            <Activity className="h-3.5 w-3.5" />
            ML: {health ? <span className="text-green-600">Healthy</span> : <span className="animate-pulse">Loading...</span>}
          </Badge>
          <Badge variant="outline" className="gap-2 py-1.5 px-3">
            <CheckCircle className="h-3.5 w-3.5" />
            RAG: {chatStatus ? <span className="text-green-600">{chatStatus.status}</span> : <span className="animate-pulse">Loading...</span>}
          </Badge>
          {chatStatus && <Badge variant="outline" className="gap-2 py-1.5 px-3">{chatStatus.documents_loaded} docs loaded</Badge>}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {quickActions.map((action) => (
          <motion.div key={action.to} variants={item}>
            <Link to={action.to}>
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border hover:border-accent/30">
                <CardContent className="p-5 space-y-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${action.color} transition-transform group-hover:scale-110`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{action.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Documents */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <h2 className="text-xl font-display font-semibold mb-4 text-foreground">Recent Documents</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Filename</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Risk</th>
                </tr></thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">
                      <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}</div>
                    </td></tr>
                  ) : history.map((doc, i) => (
                    <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="p-4 font-medium text-foreground flex items-center gap-2"><FileText className="h-4 w-4 text-accent" />{doc.filename}</td>
                      <td className="p-4"><Badge variant={doc.status === "Processed" ? "default" : "secondary"} className={doc.status === "Processed" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>{doc.status === "Processing" && <Clock className="h-3 w-3 mr-1 animate-spin" />}{doc.status}</Badge></td>
                      <td className="p-4 text-muted-foreground">{doc.date}</td>
                      <td className="p-4"><Badge variant="outline" className={doc.risk_level === "High" ? "border-destructive text-destructive" : doc.risk_level === "Medium" ? "border-accent text-accent" : "border-green-600 text-green-600"}>{doc.risk_level}</Badge></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
};

export default Dashboard;
