import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import api from '@/api/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
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
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="w-full max-w-[360px]">
        {!submitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-black mb-1">Reset password</h1>
              <p className="text-gray-500 text-sm">We'll send a link to your email</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
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
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-medium h-10"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Send Reset Link"}
              </Button>
              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors"
              >
                <ArrowLeft size={14} /> Back to login
              </Link>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <CheckCircle2 className="text-gray-600 h-6 w-6" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-black">Check your email</h1>
            <p className="text-sm text-gray-500">
              If an account exists, you'll receive a reset link.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 h-10">
                Back to login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}