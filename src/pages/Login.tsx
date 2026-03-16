import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, Mail, Lock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: "Welcome back!", description: "Successfully logged in." });
      navigate("/dashboard");
    } catch {
      toast({ title: "Error", description: "Invalid credentials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Illustration */}
      <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-light to-primary opacity-90" />
        <div className="relative z-10 text-center">
          <Scale className="h-20 w-20 text-accent mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold text-primary-foreground mb-4">Justice<span className="text-accent">Clear</span></h1>
          <p className="text-primary-foreground/70 text-lg max-w-md">AI-powered legal intelligence platform. Predict outcomes, analyze documents, and research law with cutting-edge technology.</p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-primary-foreground/60 text-sm">
            <div className="glass-dark rounded-xl p-4"><div className="text-2xl font-bold text-accent">95%</div>Accuracy</div>
            <div className="glass-dark rounded-xl p-4"><div className="text-2xl font-bold text-accent">10K+</div>Cases</div>
            <div className="glass-dark rounded-xl p-4"><div className="text-2xl font-bold text-accent">24/7</div>Available</div>
          </div>
        </div>
      </motion.div>

      {/* Right - Form */}
      <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Scale className="h-8 w-8 text-accent" />
            <span className="font-display text-2xl font-bold">Justice<span className="text-accent">Clear</span></span>
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-sm font-medium text-foreground">Password</label><Link to="/forgot-password" className="text-sm text-accent hover:underline">Forgot?</Link></div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-gold-light h-12 text-base">
              {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">Don't have an account? <Link to="/register" className="text-accent font-medium hover:underline">Sign up</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
