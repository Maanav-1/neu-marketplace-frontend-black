import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/api/client';
import { useAuthStore } from '@/store/authStore';

export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setAuth, setIsOAuthUser } = useAuthStore();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const error = searchParams.get('error');

            if (error) {
                setStatus('error');
                setErrorMessage(error);
                return;
            }

            if (!token) {
                setStatus('error');
                setErrorMessage('No authentication token received.');
                return;
            }

            try {
                // Store token temporarily to make the API call
                localStorage.setItem('token', token);

                // Fetch user profile with the token
                const { data: user } = await api.get('/users/me');

                // Set auth state with user and token
                setAuth(user, token);
                setIsOAuthUser(true);

                setStatus('success');

                // Redirect to home after a brief success message
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } catch (err: any) {
                localStorage.removeItem('token');
                setStatus('error');
                setErrorMessage(err.response?.data?.message || 'Failed to authenticate. Please try again.');
            }
        };

        handleCallback();
    }, [searchParams, navigate, setAuth]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
            {status === 'loading' && (
                <>
                    <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                    <p className="text-slate-600 font-medium">Completing sign in...</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-slate-900">Welcome back!</p>
                        <p className="text-sm text-slate-500">Redirecting you to the marketplace...</p>
                    </div>
                </>
            )}

            {status === 'error' && (
                <>
                    <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center">
                        <XCircle className="h-8 w-8 text-rose-600" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-slate-900">Authentication Failed</p>
                        <p className="text-sm text-slate-500">{errorMessage}</p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                        Return to Login
                    </button>
                </>
            )}
        </div>
    );
}
