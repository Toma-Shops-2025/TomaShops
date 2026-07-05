
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userType?: 'buyer' | 'seller') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  userType: 'buyer' | 'seller' | null;
  setUserType: (type: 'buyer' | 'seller') => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserTypeState] = useState<'buyer' | 'seller' | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Add a 3s timeout to fetchUserType so it never hangs the whole app
        await Promise.race([
          fetchUserType(session.user.id),
          new Promise((resolve) => setTimeout(resolve, 3000))
        ]);
      }
      setLoading(false);
    }).catch(err => {
      console.error("Initial session error:", err);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setLoading(true);
        await Promise.race([
          fetchUserType(session.user.id),
          new Promise((resolve) => setTimeout(resolve, 3000))
        ]);
        setLoading(false);
      } else {
        setUserTypeState(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserType = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .maybeSingle();
      
      if (data) {
        setUserTypeState(data.user_type as 'buyer' | 'seller');
      }
    } catch (error) {
      console.error('Error fetching user type:', error);
    }
  };

  const setUserType = async (type: 'buyer' | 'seller') => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          user_type: type,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setUserTypeState(type);
      toast.success(`Profile updated as ${type}`);
    } catch (error) {
      console.error('Error setting user type:', error);
      toast.error('Failed to update profile');
    }
  };

  const signUp = async (email: string, password: string, userType: 'buyer' | 'seller' = 'buyer') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { user_type: userType },
        },
      });
      if (error) throw error;
      toast.success('Registration successful! Please check your email for verification.');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Logged in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { lovable } = await import('@/integrations/lovable/index');
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message || 'Google sign-in failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed');
      throw error;
    }
  };

  const signOut = async () => {
    // Clear local state immediately so UI doesn't hang if the network call stalls
    setUserTypeState(null);
    setUser(null);
    setSession(null);
    try {
      await Promise.race([
        supabase.auth.signOut({ scope: 'local' }),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
    } catch (e) {
      console.warn('signOut error (ignored):', e);
    }
    toast.success('Logged out');
    window.location.href = '/';
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    userType,
    setUserType,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
