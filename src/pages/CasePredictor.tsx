import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { predict } from "@/services/ml";
import { useToast } from "@/hooks/use-toast";
import GaugeChart from "@/components/GaugeChart";
import AppLayout from "@/components/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";

const caseTypes = ["Criminal", "Civil", "Family", "Corporate", "Tax", "Constitutional", "Labor", "Property"];

const CasePredictor = () => {
  const [caseType, setCaseType] = useState("");
  const [lawyerExp, setLawyerExp] = useState([10]);
  const [judgeExp, setJudgeExp] = useState([15]);
  const [judgeCount, setJudgeCount] = useState(1);
  
  // 🚀 NAYE FIELDS ADD KIYE (Complexity aur Evidence)
  const [complexity, setComplexity] = useState([5]); // Default 5
  const [evidence, setEvidence] = useState([5]); // Default 5
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePredict = async () => {
    if (!caseType) {
      toast({ title: "Missing info", description: "Select a case type", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      // 🚀 NAYE PARAMS API ME BHEJ RAHE HAIN
      const res: any = await predict({ 
        case_type: caseType, 
        lawyer_exp: lawyerExp[0], 
        judge_exp: judgeExp[0], 
        judge_count: judgeCount,
        complexity: complexity[0],
        evidence: evidence[0]
      });

      // Data Extract Karne ka safe tarika (Kyunki backend shayad { data: { data: {...} } } bhej raha ho)
      const predictionData = res?.data?.data || res?.data || res;
      setResult(predictionData);

      toast({ title: "Prediction complete!", description: `Win probability: ${predictionData.win_probability}%` });
    } catch {
      toast({ title: "Error", description: "Prediction failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Scale className="h-8 w-8 text-accent" /> Case Prediction Engine
          </h1>
          <p className="text-muted-foreground mt-2">Enter case parameters to predict the outcome probability using our ML model.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="border-border">
            <CardHeader><CardTitle className="font-display">Case Parameters</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Case Type</Label>
                <Select value={caseType} onValueChange={setCaseType}>
                  <SelectTrigger><SelectValue placeholder="Select case type" /></SelectTrigger>
                  <SelectContent>{caseTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Lawyer Experience: <span className="text-accent font-bold">{lawyerExp[0]} years</span></Label>
                <Slider value={lawyerExp} onValueChange={setLawyerExp} max={50} step={1} />
              </div>

              <div className="space-y-3">
                <Label>Judge Experience: <span className="text-accent font-bold">{judgeExp[0]} years</span></Label>
                <Slider value={judgeExp} onValueChange={setJudgeExp} max={50} step={1} />
              </div>

              <div className="space-y-2">
                <Label>Number of Judges</Label>
                <Input type="number" min={1} max={15} value={judgeCount} onChange={(e) => setJudgeCount(Number(e.target.value))} />
              </div>

              {/* 🚀 NAYA UI: COMPLEXITY SLIDER */}
              <div className="space-y-3">
                <Label>Case Complexity (1-10): <span className="text-accent font-bold">{complexity[0]}</span></Label>
                <Slider value={complexity} onValueChange={setComplexity} min={1} max={10} step={1} />
              </div>

              {/* 🚀 NAYA UI: EVIDENCE SLIDER */}
              <div className="space-y-3">
                <Label>Evidence Strength (1-10): <span className="text-accent font-bold">{evidence[0]}</span></Label>
                <Slider value={evidence} onValueChange={setEvidence} min={1} max={10} step={1} />
              </div>

              <Button onClick={handlePredict} disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-gold-light h-12">
                {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" /> : <><TrendingUp className="h-4 w-4" /> Predict Outcome</>}
              </Button>
            </CardContent>
          </Card>

          {/* Result */}
          <Card className="border-border">
            <CardHeader><CardTitle className="font-display">Prediction Result</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
              {loading ? (
                <div className="space-y-4 w-full">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              ) : result ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full space-y-6">
                  <GaugeChart value={result.win_probability} />
                  <div className="glass rounded-2xl p-6 space-y-3 text-left w-full mx-auto">
                    {/* Yahan API return mein case_type nahi tha, toh humne apna local state (caseType) use kar liya */}
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Case Type</span>
                      <span className="font-medium text-foreground">{caseType || "N/A"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Win Probability</span>
                      <span className="font-bold text-accent text-lg">{result.win_probability}%</span>
                    </div>
                    
                    {/* 🚀 NAYA OUTPUT FIELD (Case Strength) */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Case Strength</span>
                      <span className={`font-bold px-2 py-1 rounded text-xs ${result.case_strength === "Strong" ? "bg-green-500/20 text-green-500" : result.case_strength === "Weak" ? "bg-red-500/20 text-red-500" : "bg-accent/20 text-accent"}`}>
                        {result.case_strength || "Analyzed"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Scale className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Enter parameters and click predict to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default CasePredictor;