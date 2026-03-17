import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
// 🚀 Asli API request function import kar rahe hain
import { apiRequest } from "../services/api"; 

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Humne register ko hata diya context se kyunki hum directly API hit karenge OTP ke sath
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🚀 ASLI /send-otp API CALL
      await apiRequest("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      
      setShowOtp(true);
      toast({ title: "OTP Sent!", description: "Check your email for the verification code." });
    } catch (error) {
      console.error("OTP Error:", error);
      toast({ title: "Error", description: "Failed to send OTP. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      // 🚀 ASLI /register API CALL (Fixed Data Mapping)
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ 
          userName: name,              // Backend expects 'userName', hum 'name' state bhej rahe hain
          email: email, 
          password: password, 
          confirmPassword: password,   // Backend ko confirmPassword chahiye, toh same password pass kar diya
          otp: otp 
        }), 
      });

      toast({ title: "Account created!", description: "Welcome to JusticeClear." });
      
      // Register hone ke baad automatically login kara do
      await login(email, password);
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration Error:", error);
      toast({ title: "Error", description: "Invalid OTP or registration failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex">
      <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-light to-primary opacity-90" />
        <div className="relative z-10 text-center">
          <Scale className="h-20 w-20 text-accent mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold text-primary-foreground mb-4">Join <span className="text-accent">JusticeClear</span></h1>
          <p className="text-primary-foreground/70 text-lg max-w-md">Start making data-driven legal decisions today. Access AI-powered case prediction, document analysis, and legal research tools.</p>
        </div>
      </motion.div>

      <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Scale className="h-8 w-8 text-accent" />
            <span className="font-display text-2xl font-bold">Justice<span className="text-accent">Clear</span></span>
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display text-foreground">Create account</h2>
            <p className="text-muted-foreground mt-2">Get started with your legal AI platform</p>
          </div>

          {!showOtp ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-gold-light h-12 text-base">
                {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
              <div className="glass rounded-2xl p-6 text-center space-y-4">
                <Mail className="h-12 w-12 text-accent mx-auto" />
                <h3 className="text-lg font-semibold">Verify your email</h3>
                <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to {email}</p>
                <Input placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} className="text-center text-2xl tracking-[0.5em] font-mono" maxLength={6} />
                <Button onClick={handleVerifyOtp} disabled={otp.length !== 6 || loading} className="w-full bg-accent text-accent-foreground hover:bg-gold-light h-12">
                  {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" /> : "Verify & Continue"}
                </Button>
              </div>
            </motion.div>
          )}
          <p className="text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;