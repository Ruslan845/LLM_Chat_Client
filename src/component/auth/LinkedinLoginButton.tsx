'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '@/store/userSlice'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_AUTH_URL}/auth`

interface ChildProps {
    onSendData: (data: string) => void;
}

export default function LinkedInAuth({onSendData} : ChildProps) {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();

  // Step 1: Redirect user to LinkedIn
  const handleLogin = () => {
    const state = Math.random().toString(36).substring(7) // You can persist this to verify later
    const scope = 'r_liteprofile r_emailaddress'
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&state=${state}&scope=${encodeURIComponent(scope)}`
    window.location.href = authUrl
  }

  // Step 2: Handle callback (code in URL)
  useEffect(() => {
    const code = searchParams ? searchParams.get('code') : null;
    const state = searchParams ? searchParams.get('state') : null;


    console.log('LinkedIn code:', code)

    if (code) {
      const sendCodeToBackend = async () => {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/linkedin/`,
            { code, redirect_uri: REDIRECT_URI },
            { withCredentials: true }
          )

        console.log('Data sent successfully:', response.data);

        // Check if the account is active
        if (!response.data.user.is_active) {
            onSendData("You can't access this site. Your account was suspended."); // Set error message
            return; // Stop further execution and prevent URL change
        }

        localStorage.setItem('access', response.data.access_token);
        localStorage.setItem('refrest', response.data.refresh_token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        console.log(response.data)
        console.log(localStorage.getItem("userData"))
        dispatch(setCurrentUser(response.data.user)); // Update Redux state
        router.push('/'); // Redirect to the home page
            

          // save user/token, redirect, etc.
          router.push('/')
        } catch (err: any) {
          console.error('Login failed:', err)
        }
      }

      sendCodeToBackend()
    }
  }, [searchParams])

  return (
    <button onClick={handleLogin} className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
        <img
                src="/linkedin-icon.svg"
                alt="LinkedIn"
                className="w-5 h-5 mr-2"
            />
        Sign in with LinkedIn
    </button>
  )
}
