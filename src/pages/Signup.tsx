import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Loader2, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

type SignupStep = 'details' | 'verify';

export default function Signup() {
  const [step, setStep] = useState<SignupStep>('details');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/signup', formData);
      setStep('verify');
      toast({ 
        title: "Verification Sent", 
        description: "Please check your Northeastern email for the 6-digit code." 
      });
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Signup failed", 
        description: err.response?.data?.message || "Something went wrong. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify', { 
        email: formData.email, 
        code: verificationCode 
      });
      
      setAuth(data.user, data.token);
      toast({ 
        title: "Welcome to the community!", 
        description: "Your account has been successfully verified." 
      });
      navigate('/');
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Verification failed", 
        description: "Invalid or expired code." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Redirects to the backend OAuth2 endpoint
    window.location.href = '/api/oauth2/authorization/google';
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[85vh] px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px]"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter mb-2">
            neu<span className="text-blue-500">-Marketplace</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
            Join the Husky Ecosystem
          </p>
        </div>

        <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'details' ? (
              <motion.div
                key="details"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold tracking-tight">Create your account</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                        <Input 
                          placeholder="Justin Husky" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="bg-zinc-900 border-zinc-800 pl-10 h-12"
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                        <Input 
                          type="email" 
                          placeholder="name@northeastern.edu" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="bg-zinc-900 border-zinc-800 pl-10 h-12"
                          required 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="bg-zinc-900 border-zinc-800 pl-10 h-12"
                          required 
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl mt-2 font-bold shadow-lg shadow-blue-500/20"
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Sign Up <ArrowRight size={16} /></span>}
                    </Button>
                  </form>

                  {/* Visual Separator */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                      <span className="bg-zinc-950 px-2 text-zinc-500 font-bold tracking-widest">Or continue with</span>
                    </div>
                  </div>

                  {/* Google Sign-Up Button */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGoogleSignup}
                    className="w-full h-12 rounded-xl border-zinc-800 bg-transparent hover:bg-zinc-900 font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </Button>
                </CardContent>
                <CardFooter className="border-t border-zinc-900 pt-6">
                  <p className="text-sm text-zinc-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 font-bold hover:underline">Log in</Link>
                  </p>
                </CardFooter>
              </motion.div>
            ) : (
              <motion.div
                key="verify"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold tracking-tight">Verify Email</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <ShieldCheck className="text-blue-500 h-8 w-8" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-300">We've sent a 6-digit code to</p>
                    <p className="text-sm font-bold text-blue-400">{formData.email}</p>
                  </div>
                  
                  <form onSubmit={handleVerify} className="space-y-6">
                    <Input 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="bg-zinc-900 border-zinc-800 text-center text-3xl tracking-[0.5em] font-mono h-20 focus:ring-2 focus:ring-blue-600"
                      placeholder="000000"
                      required
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold shadow-lg shadow-blue-500/20"
                      disabled={loading || verificationCode.length < 6}
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "Verify & Complete"}
                    </Button>
                    <button 
                      type="button"
                      onClick={() => setStep('details')}
                      className="flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-white mx-auto transition-colors"
                    >
                      <ArrowLeft size={14} /> Use a different email
                    </button>
                  </form>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { label: 'Secure', icon: ShieldCheck },
            { label: 'Verified', icon: CheckCircle2 },
            { label: 'Internal', icon: User }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <item.icon size={14} className="text-zinc-500" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}