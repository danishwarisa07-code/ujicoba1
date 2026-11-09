import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  getUserProfile, 
  syncUserStudyTime, 
  logoutUser, 
  UserProfile 
} from '../firebase.ts';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  totalStudySeconds: number;
  syncStatus: 'synced' | 'syncing' | 'error' | 'idle';
  refreshUserProfile: () => Promise<void>;
  syncStudyTime: (seconds?: number) => Promise<void>;
  logout: () => Promise<void>;
  formatStudyTime: (sec: number) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalStudySeconds, setTotalStudySeconds] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'idle'>('idle');

  // Ref to hold current total seconds for intervals and unload handlers
  const totalSecondsRef = useRef(0);
  totalSecondsRef.current = totalStudySeconds;

  const currentUserRef = useRef<User | null>(null);
  currentUserRef.current = currentUser;

  // Format seconds to HH:MM:SS
  const formatStudyTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }, []);

  // Sync current timer to Firestore
  const syncStudyTime = useCallback(async (seconds?: number) => {
    const user = currentUserRef.current;
    if (!user) return;

    const timeToSync = typeof seconds === 'number' ? seconds : totalSecondsRef.current;
    setSyncStatus('syncing');

    try {
      await syncUserStudyTime(user.uid, timeToSync);
      setSyncStatus('synced');
      setUserProfile(prev => prev ? { ...prev, totalSeconds: timeToSync } : null);
    } catch (err) {
      console.error('Failed to sync study time:', err);
      setSyncStatus('error');
    }
  }, []);

  // Refresh profile from Firestore
  const refreshUserProfile = useCallback(async () => {
    if (!currentUser) return;
    try {
      const profile = await getUserProfile(currentUser);
      setUserProfile(profile);
      setTotalStudySeconds(profile.totalSeconds || 0);
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  }, [currentUser]);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        try {
          const profile = await getUserProfile(user);
          setUserProfile(profile);
          const initialSeconds = profile.totalSeconds || 0;
          setTotalStudySeconds(initialSeconds);
          totalSecondsRef.current = initialSeconds;
          setSyncStatus('synced');
        } catch (e) {
          console.error('Error fetching initial profile:', e);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setTotalStudySeconds(0);
        totalSecondsRef.current = 0;
        setSyncStatus('idle');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Ticker: increment timer every second when logged in
  useEffect(() => {
    if (!currentUser) return;

    const timer = setInterval(() => {
      setTotalStudySeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUser]);

  // Periodic Firestore sync every 25 seconds
  useEffect(() => {
    if (!currentUser) return;

    const syncInterval = setInterval(() => {
      syncStudyTime();
    }, 25000);

    return () => clearInterval(syncInterval);
  }, [currentUser, syncStudyTime]);

  // Save on page unload / blur
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentUserRef.current) {
        syncStudyTime();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [syncStudyTime]);

  const logout = async () => {
    if (currentUser) {
      await syncStudyTime();
    }
    await logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        totalStudySeconds,
        syncStatus,
        refreshUserProfile,
        syncStudyTime,
        logout,
        formatStudyTime
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
