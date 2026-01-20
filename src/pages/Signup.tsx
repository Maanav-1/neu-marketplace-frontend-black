import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
        title: "Check your email",
        description: "We sent you a 6-digit verification code."
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: err.response?.data?.message || "Something went wrong."
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
        title: "Welcome!",
        description: "Your account has been verified."
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
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[85vh] px-4 py-12">
      <div className="w-full max-w-[360px]">
        <AnimatePresence mode="wait">
          {step === 'details' ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
                  Create an account
                </h1>
                <p className="text-gray-500 text-sm">
                  Join the NEU marketplace
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Name Field */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white border-gray-200 pl-10 h-10 focus:border-gray-400 focus:ring-0"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="you@northeastern.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white border-gray-200 pl-10 h-10 focus:border-gray-400 focus:ring-0"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-white border-gray-200 pl-10 h-10 focus:border-gray-400 focus:ring-0"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white font-medium h-10 mt-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Continue <ArrowRight size={14} />
                      </span>
                    )}
                  </Button>
                </form>

                {/* Separator */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-gray-400">or</span>
                  </div>
                </div>

                {/* Google Sign-Up */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignup}
                  className="w-full h-10 border-gray-200 bg-white hover:bg-gray-50 font-medium text-gray-700"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </Button>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{' '}
                  <Link to="/login" className="text-black font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Verification Step */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <ShieldCheck className="text-gray-600 h-6 w-6" />
                  </div>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
                  Check your email
                </h1>
                <p className="text-gray-500 text-sm">
                  Enter the 6-digit code we sent to
                </p>
                <p className="text-black text-sm font-medium">{formData.email}</p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="bg-white border-gray-200 text-center text-2xl tracking-[0.4em] font-mono h-14 focus:border-gray-400 focus:ring-0"
                  placeholder="000000"
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium h-10"
                  disabled={loading || verificationCode.length < 6}
                >
                  {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Verify"}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-black mx-auto transition-colors"
                >
                  <ArrowLeft size={14} /> Use a different email
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}