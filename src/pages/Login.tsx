import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      let message = 'Authentication failed. Please try again.';
      if (error.toLowerCase().includes('blocked')) {
        message = 'Your account has been blocked. Please contact support.';
      } else if (error.toLowerCase().includes('disabled')) {
        message = 'Your account has been disabled.';
      }
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: message
      });
    }
  }, [searchParams, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.token);
      toast({
        title: "Welcome back!",
        description: `Signed in as ${data.user.name}`
      });
      navigate('/');
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: err.response?.data?.message || "Invalid email or password."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-[360px]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="you@northeastern.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-gray-200 pl-10 h-10 focus:border-gray-400 focus:ring-0"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

          {/* Google Sign-In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
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
            Don't have an account?{' '}
            <Link to="/signup" className="text-black font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}