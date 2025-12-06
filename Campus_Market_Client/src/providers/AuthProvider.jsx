import { createContext, use, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleProvider = new GoogleAuthProvider();

    // Create user with email and password
    const createUser = (email, password) => {
        setLoading = true;
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Sign in with email and password
    const signIn = (email, password) => {
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password);
    };

    // Sign in with google
    const signInWithGoogle = () => {
        setLoading(true);
        signInWithPopup(auth, googleProvider);
    };

    // update user profile
    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photo
        });
    };

    //logout
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    // observe auth stage change    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);

            // Get JWT token when user logs in
            if (currentUser) {
                const userInfo = { email: currentUser.email };
                axios.post("http://localhost:5001/jwt", userInfo)
                    .then(res => {
                        if (res.data.token) {
                            localStorage.setItem
                                ('access-token', res.data.token);
                        }
                    })
                    .catch(error=>console.error('JWT Error:', error));
            } else {
                localStorage.removeItem('access-token');
            }

            setLoading(false);
        });
        return()=> unsubscribe();
    }, []);

    const authInfo={
        user,
        loading,
        createUser,
        signIn,
        signInWithGoogle,
        logOut,
        updateProfile
    };

    return(
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>

    );
};

export default AuthProvider;