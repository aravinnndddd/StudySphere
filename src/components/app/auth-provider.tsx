'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider, isFirebaseEnabled } from '@/lib/firebase';
import { LoaderCircle } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isFirebaseEnabled: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseEnabled || !auth) {
      setLoading(false);
      return;
    }

    // This handles the redirect result from Google Sign-In.
    // It's called when the page loads to see if the user has just been redirected back.
    getRedirectResult(auth)
      .catch((error) => {
        console.error("Error processing redirect result", error);
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!isFirebaseEnabled || !auth || !googleProvider) {
      console.error('Firebase not configured. Cannot sign in.');
      return;
    }
    try {
      // We use signInWithRedirect instead of a popup.
      // This is more robust in different environments.
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const signOut = async () => {
    if (!isFirebaseEnabled || !auth) {
      console.error('Firebase not configured. Cannot sign out.');
      return;
    }
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, isFirebaseEnabled }}>
      {children}
    </AuthContext.Provider>
  );
}
