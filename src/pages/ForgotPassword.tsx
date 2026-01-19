import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import api from '@/api/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // POST /api/auth/forgot-password
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast({ title: "Email sent", description: "If an account exists, you will receive a reset link." });
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Request failed", 
        description: err.response?.data?.message || "Something went wrong." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-[400px] border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tighter">Reset Password</CardTitle>
            <p className="text-sm text-zinc-500">We'll send a link to your NU email.</p>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <Input 
                      type="email" 
                      placeholder="student@northeastern.edu" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="bg-zinc-900 pl-10 h-12" 
                      required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-12" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                </Button>
                <Link to="/login" className="flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors pt-2">
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-500" />
                  </div>
                </div>
                <p className="text-sm text-zinc-400">
                  Check your inbox for instructions to reset your password.
                </p>
                <Link to="/login">
                  <Button variant="outline" className="w-full border-zinc-800">Return to Login</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}