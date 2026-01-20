import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ArrowRight, Loader2, MailCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import api from '@/api/client';
import { useToast } from '@/hooks/use-toast';

export default function VerificationBanner() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const showBanner = user && !user.emailVerified;

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await api.post('/auth/resend-verification', { email: user?.email });
      toast({
        title: "Code Sent",
        description: "A new 6-digit verification code is on its way to your inbox."
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to resend",
        description: err.response?.data?.message || "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-indigo-50 border-b border-indigo-100 overflow-hidden"
        >
          <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="text-indigo-600 h-4 w-4" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-semibold text-indigo-900">
                  Your Husky account is not fully verified yet.
                </p>
                <p className="text-xs text-indigo-600 font-medium mt-0.5">
                  Verify your email to unlock Chat and Listing features
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendCode}
                disabled={loading}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100"
              >
                {loading ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : <MailCheck size={14} className="mr-2" />}
                Resend Code
              </Button>
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-full px-4 shadow-sm"
                onClick={() => window.location.href = '/signup?step=verify'}
              >
                Verify Now <ArrowRight size={12} className="ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}