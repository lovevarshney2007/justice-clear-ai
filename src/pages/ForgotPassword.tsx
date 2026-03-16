import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, Mail, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    toast({ title: "Email sent!", description: "Check your inbox for a reset link." });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8">
        <div className="flex items-center gap-2">
          <Scale className="h-8 w-8 text-accent" />
          <span className="font-display text-2xl font-bold">Justice<span className="text-accent">Clear</span></span>
        </div>
        {!sent ? (
          <>
            <div><h2 className="text-3xl font-bold font-display">Reset password</h2><p className="text-muted-foreground mt-2">We'll send you a reset link</p></div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-gold-light h-12">
                {loading ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" /> : "Send Reset Link"}
              </Button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-8 text-center space-y-4">
            <Mail className="h-16 w-16 text-accent mx-auto" />
            <h3 className="text-xl font-semibold">Check your email</h3>
            <p className="text-muted-foreground">We sent a reset link to <strong>{email}</strong></p>
          </motion.div>
        )}
        <Link to="/login" className="flex items-center gap-2 text-sm text-accent hover:underline"><ArrowLeft className="h-4 w-4" />Back to login</Link>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
