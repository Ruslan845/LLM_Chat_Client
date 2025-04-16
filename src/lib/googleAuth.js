import { app } from './firebase_googleClient';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const googleSignIn = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        // console.log('Successfully signed in with Google:', user);
        const idToken = await user.getIdToken();
        return { user, idToken };
    } catch (error) {
        console.error('Error during Google sign-in:', error);
        if(error.code === 'auth/cancelled-popup-request') {
            console,log('User cancelled the sign-in flow.');
        }
        throw error;
    }
}