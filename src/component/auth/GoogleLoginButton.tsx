"use Client";
import { googleSignIn } from "@/lib/googleAuth";
import { useState } from "react";
import axios from 'axios';
import { useDispatch, useSelector } from'react-redux';
import { setCurrentUser } from "@/store/userSlice";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

interface ChildProps {
    onSendData: (data: string) => void;
}

const GoogleLoginButton = ({onSendData} : ChildProps) => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const router = useRouter();

    const handleGoogleLogin = async () => {
        try {
            const { user, idToken } = await googleSignIn();
            console.log("User signed in:", user);
            console.log("ID Token:", idToken);
            setLoading(true); // Start loading

            await axios.get(`${API_BASE_URL}/auth/set-csrf-cookie/`, {
                withCredentials: true, // Include cookies in the request
            });

            try {
            const csrfToken = getCookie('csrftoken');

            console.log(csrfToken);

            const response = await axios.post(
                `${API_BASE_URL}/auth/google/`,
                { token: idToken },
                {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken || '',
                },
                withCredentials: true, // Include cookies in the request
                }
            );

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
            
            

            // Save user data and redirect
            //   dispatch(setCurrentUser(response.data.user)); // Update Redux state
            //   localStorage.setItem('userData', JSON.stringify(response.data.user));
            //   router.push('/'); // Redirect to the home page
            } catch (error) {
            console.error('Error sending data:', error);
            } finally {
            setLoading(false); // Stop loading
            }
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    };

    if(loading){
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="loader-ring mb-4"></div>
                </div>
            </div>
        );
    };
    
    return (
        <button onClick={handleGoogleLogin} className="bg-blue-500 text-white p-2 rounded flex items-center justify-center w-full">
            <img
                src="/google-icon.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
            />
            Sign in with Google
        </button>
    );
};

export default GoogleLoginButton;