'use client';

import { signIn, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { setCurrentUser } from '@/store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import GoogleLoginButton from '@/component/auth/GoogleLoginButton';
import LinkedInLoginButton from '@/component/auth/LinkedinLoginButton';

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SignInPage() {
  const { data: session } = useSession();
  const [method, setMethod] = useState<number | null>(null);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const router = useRouter();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const sidebar = document.querySelector('aside'); // Assuming your sidebar is an <aside> element
    if (sidebar) {
      sidebar.style.display = 'none'; // Hide the sidebar
    }

    // Cleanup: Restore the sidebar when leaving the page
    return () => {
      if (sidebar) {
        sidebar.style.display = ''; // Reset the sidebar display
      }
    };
  }, []);

  // Load the method value from localStorage on component mount
  useEffect(() => {
    const storedMethod = localStorage.getItem('authMethod');
    if (storedMethod) {
      setMethod(Number(storedMethod));
    }
  }, []);

  // Send token to backend when session and method are available
  useEffect(() => {
    console.log(session)
    // if (session && method !== null && !localStorage.getItem('userData')) {
    //   setLoading(true); // Start loading
    //   console.log('Session updated, sending token to backend...');
    //   sendTokenToBackend(method, session);
    // }
  }, [session, method]);

  const handleSignIn = (provider: string, methodValue: number) => {
    setMethod(methodValue); // Set the method value
    localStorage.setItem('authMethod', methodValue.toString()); // Persist the method value
    signIn(provider); // Trigger the sign-in process
  };

  const sendTokenToBackend = async (methodValue: number, session: Session) => {
    const urls = [
      `${API_BASE_URL}/auth/google/`,
      `${API_BASE_URL}/auth/facebook/`,
      `${API_BASE_URL}/auth/linkedin/`,
    ];

    try {
      setLoading(true); // Start loading

      // Send token to the backend
      const response = await axios.post(
        `${API_BASE_URL}/auth/linkedin/`,
        { token: methodValue == 1 ? session?.idToken : session?.accessToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Include cookies in the request
        }
      );

      console.log('Data sent successfully:', response.data);

      // Check if the account is active
      if (!response.data.user.is_active) {
        setErrorMessage("You can't access this site. Your account was suspended."); // Set error message
        return; // Stop further execution and prevent URL change
      }

      // Save user data and redirect
      dispatch(setCurrentUser(JSON.stringify(response.data.user))); // Update Redux state

      console.log("state", useSelector((state : any) => state.currentuser?.is_admin))
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      router.push('/'); // Redirect to the home page
    } catch (error) {
      console.error('Error sending data:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleGoogleSignUp = () => {
    setMethod(1);
    localStorage.setItem('authMethod', '1');
    signIn('google', { callbackUrl: '/' });
  };

  const receiveErrorMessage = (message : string) => {
    setErrorMessage(message);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="loader-ring mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
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

        <>
          {isSignUp ? (
            // Google Sign-Up Button
            <div className="space-y-4">
              <button
                onClick={handleGoogleSignUp}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <img
                  src="/google-icon.svg"
                  alt="Google"
                  className="w-6 h-6 mr-2"
                />
                Sign up with Google
              </button>
            </div>
          ) : (
            // Sign-In Buttons
            <div className="space-y-4">
              <GoogleLoginButton onSendData={receiveErrorMessage}/>
              {/* <Suspense fallback={<div>Loading auth page...</div>}>
                <LinkedInLoginButton onSendData={receiveErrorMessage}/>
              </Suspense> */}
              {/* <button
                onClick={() => handleSignIn('google', 1)}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <img
                  src="/google-icon.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Sign in with Google
              </button> */}
              {/* <button
                onClick={() => handleSignIn('facebook', 2)}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <img
                  src="/facebook-icon.svg"
                  alt="Facebook"
                  className="w-5 h-5 mr-2"
                />
                Sign in with Facebook
              </button> */}
              <button
                onClick={() => handleSignIn('linkedin', 3)}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <img
                  src="/linkedin-icon.svg"
                  alt="LinkedIn"
                  className="w-5 h-5 mr-2"
                />
                Sign in with LinkedIn
              </button>
            </div>
          )}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isSignUp
                ? 'Already have an account?'
                : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-blue-500 hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </>
      </div>
    </div>
  );
}