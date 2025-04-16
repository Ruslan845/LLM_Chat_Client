'use client';

import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { setCurrentUser } from '@/store/userSlice';
import { useDispatch } from 'react-redux';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SignInPage() {
  const { data: session } = useSession();
  const [method, setMethod] = useState<number | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const sidebar = document.querySelector('aside');
    if (sidebar) sidebar.style.display = 'none';
    return () => {
      if (sidebar) sidebar.style.display = '';
    };
  }, []);

  useEffect(() => {
    const storedMethod = localStorage.getItem('authMethod');
    if (storedMethod) setMethod(Number(storedMethod));
  }, []);

  useEffect(() => {
    if (session && method !== null && !localStorage.getItem('userData')) {
      setLoading(true);
      sendTokenToBackend(method, session);
    }
  }, [session, method]);

  const handleSignIn = (provider: string, methodValue: number) => {
    setMethod(methodValue);
    localStorage.setItem('authMethod', methodValue.toString());
    signIn('google');
  };

  const sendTokenToBackend = async (methodValue: number, session: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/google/`,
        { token: methodValue == 1 ? session?.idToken : session?.accessToken },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (!response.data.user.is_active) {
        setErrorMessage("You can't access this site. Your account was suspended.");
        return;
      }

      dispatch(setCurrentUser(response.data.user));
      localStorage.setItem('access', response.data.access_token);
      localStorage.setItem('refresh', response.data.refresh_token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      router.push('/');
    } catch (error) {
      console.error('Error sending token:', error);
      setErrorMessage('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </h2>
        <p className="text-sm text-center text-gray-600">
          {isSignUp
            ? 'Sign up with Google to start your journey with us!'
            : 'Sign in to continue to your account.'}
        </p>
        {errorMessage && (
          <p className="text-sm text-center text-red-500 mt-2">{errorMessage}</p>
        )}
        <div className="mt-6 space-y-4">
          <button
            onClick={() => handleSignIn('google', 1)}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <img
              src="/google-icon.svg"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign {isSignUp ? 'up' : 'in'} with Google
          </button>
        </div>
      </div>
    </div>
  );
}
