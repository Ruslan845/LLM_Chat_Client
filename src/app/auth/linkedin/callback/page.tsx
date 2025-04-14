// pages/api/auth/linkedin/callback.tsx or app/auth/linkedin/callback/page.tsx (if using App Router)
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const LinkedInCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');

      if (code) {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/linkedin/`,
            { code, state },
            { withCredentials: true }
          );
          router.push('/home'); // or wherever you want
        } catch (err) {
          console.error('LinkedIn login error', err);
        }
      }
    };

    handleAuth();
  }, []);

  return <p>Logging in with LinkedIn...</p>;
};

export default LinkedInCallback;
