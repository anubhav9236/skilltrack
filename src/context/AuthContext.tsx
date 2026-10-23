import React, { createContext, useContext, useState, useEffect } from 'react';
import { ID } from 'appwrite';
import { account, isAppwriteConfigured } from '../lib/appwrite';
import { UserProfile } from '../types/database';
import { DEMO_USER } from '../services/mockData';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  enterDemoMode: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize session on mount
  useEffect(() => {
    async function checkCurrentSession() {
      setLoading(true);
      setError(null);

      // Check if user previously saved demo mode in session
      const storedDemo = localStorage.getItem('skilltrack_demo_mode');
      if (storedDemo === 'true') {
        setUser(DEMO_USER);
        setIsDemoMode(true);
        setLoading(false);
        return;
      }

      if (!isAppwriteConfigured()) {
        // Appwrite not configured yet: Start in Demo Mode so reviewer can explore instantly
        setUser(DEMO_USER);
        setIsDemoMode(true);
        setLoading(false);
        return;
      }

      try {
        const currentUser = await account.get();
        setUser({
          $id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
          emailVerification: currentUser.emailVerification,
        });
        setIsDemoMode(false);
      } catch (err: any) {
        // 401 indicates no active session
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkCurrentSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    if (!isAppwriteConfigured()) {
      // If user enters any credentials in demo mode
      setUser({
        $id: 'user-' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email,
      });
      setIsDemoMode(true);
      localStorage.setItem('skilltrack_demo_mode', 'true');
      setLoading(false);
      return;
    }

    try {
      // First delete any lingering current session to avoid 409 conflict
      try {
        await account.deleteSession('current');
      } catch {
        // ignore if none exists
      }

      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser({
        $id: currentUser.$id,
        name: currentUser.name,
        email: currentUser.email,
        emailVerification: currentUser.emailVerification,
      });
      setIsDemoMode(false);
      localStorage.removeItem('skilltrack_demo_mode');
    } catch (err: any) {
      console.error('[AuthContext] Login failed:', err);
      const msg = err?.message || 'Login failed. Please verify your credentials and try again.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    if (!isAppwriteConfigured()) {
      setUser({
        $id: 'user-' + Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        email: email.trim(),
      });
      setIsDemoMode(true);
      localStorage.setItem('skilltrack_demo_mode', 'true');
      setLoading(false);
      return;
    }

    try {
      // 1. Create Appwrite Account
      await account.create(ID.unique(), email, password, name);
      // 2. Immediately establish session for seamless UX
      await account.createEmailPasswordSession(email, password);
      // 3. Fetch user details
      const currentUser = await account.get();
      setUser({
        $id: currentUser.$id,
        name: currentUser.name,
        email: currentUser.email,
        emailVerification: currentUser.emailVerification,
      });
      setIsDemoMode(false);
      localStorage.removeItem('skilltrack_demo_mode');
    } catch (err: any) {
      console.error('[AuthContext] Registration failed:', err);
      const msg = err?.message || 'Registration failed. Please check your details.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isAppwriteConfigured() && !isDemoMode) {
        await account.deleteSession('current');
      }
    } catch (err) {
      console.warn('[AuthContext] Logout session deletion notice:', err);
    } finally {
      setUser(null);
      setIsDemoMode(false);
      localStorage.removeItem('skilltrack_demo_mode');
      setLoading(false);
    }
  };

  const enterDemoMode = () => {
    setUser(DEMO_USER);
    setIsDemoMode(true);
    localStorage.setItem('skilltrack_demo_mode', 'true');
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoMode,
        error,
        login,
        register,
        logout,
        enterDemoMode,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
