
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface UserTutorialProgress {
  tutorialId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  completedAt?: string;
  startedAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  userProgress: UserTutorialProgress[];
  markTutorialAsCompleted: (tutorialId: string) => void;
  startTutorial: (tutorialId: string) => void;
  getUserTutorialProgress: (tutorialId: string) => UserTutorialProgress | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserTutorialProgress[]>([]);

  // Debug logs
  console.log('AuthProvider - User:', user);
  console.log('AuthProvider - Session:', session);
  console.log('AuthProvider - IsLoading:', isLoading);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session);
        setSession(session);
        
        if (session?.user) {
          console.log('Fetching profile for user ID:', session.user.id);
          console.log('User email:', session.user.email);
          
          // Use setTimeout to avoid blocking the auth callback
          setTimeout(async () => {
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              console.log('Profile query result:', { profile, profileError });
              
              if (profileError) {
                console.error('Error fetching profile:', profileError);
                setUser(null);
              } else if (profile) {
                console.log('Setting user profile:', profile);
                setUser({
                  id: profile.id,
                  email: profile.email,
                  name: profile.name,
                  role: profile.role
                });
                
                // Load user progress
                loadUserProgress(session.user.id);
              } else {
                console.log('No profile found for user, creating default profile');
                // Create a default profile if none exists
                const { data: newProfile, error: createError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                    role: 'user'
                  })
                  .select()
                  .single();
                
                if (createError) {
                  console.error('Error creating profile:', createError);
                  setUser(null);
                } else if (newProfile) {
                  console.log('Created new profile:', newProfile);
                  setUser({
                    id: newProfile.id,
                    email: newProfile.email,
                    name: newProfile.name,
                    role: newProfile.role
                  });
                  
                  // Load user progress
                  loadUserProgress(session.user.id);
                }
              }
            } catch (error) {
              console.error('Unexpected error in profile fetch:', error);
              setUser(null);
            }
          }, 0);
        } else {
          setUser(null);
          setUserProgress([]);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // The auth state change listener will handle this
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProgress = async (userId: string) => {
    console.log('Loading user progress for:', userId);
    const { data: progress, error } = await supabase
      .from('user_tutorials')
      .select(`
        *,
        tutorials:tutorial_id (id, slug)
      `)
      .eq('user_id', userId);

    console.log('User progress data:', progress, 'Error:', error);

    if (progress) {
      const formattedProgress = progress.map(p => ({
        tutorialId: p.tutorial_id,
        status: p.status,
        progress: p.progress || 0,
        startedAt: p.started_at,
        completedAt: p.completed_at
      }));
      console.log('Formatted progress:', formattedProgress);
      setUserProgress(formattedProgress);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setIsLoading(false);
    return !error;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name
        }
      }
    });

    setIsLoading(false);
    return !error;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });

    return !error;
  };

  const logout = async () => {
    console.log('Déconnexion en cours...');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserProgress([]);
    console.log('Déconnexion terminée');
  };

  const markTutorialAsCompleted = async (tutorialId: string) => {
    if (!user) return;

    console.log('Marking tutorial as completed:', tutorialId);
    
    const { data, error } = await supabase
      .from('user_tutorials')
      .upsert({
        user_id: user.id,
        tutorial_id: tutorialId,
        status: 'completed',
        progress: 100,
        completed_at: new Date().toISOString(),
        started_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,tutorial_id'
      })
      .select();

    console.log('Upsert result:', data, 'Error:', error);

    if (!error) {
      // Reload progress immediately
      await loadUserProgress(user.id);
    }
  };

  const startTutorial = async (tutorialId: string) => {
    if (!user) return;

    console.log('Starting tutorial:', tutorialId, 'Current progress:', userProgress);
    const existingProgress = userProgress.find(p => p.tutorialId === tutorialId);
    
    if (!existingProgress) {
      console.log('No existing progress, creating new entry');
      const { data, error } = await supabase
        .from('user_tutorials')
        .insert({
          user_id: user.id,
          tutorial_id: tutorialId,
          status: 'in_progress',
          progress: 0,
          started_at: new Date().toISOString()
        })
        .select();

      console.log('Insert result:', data, 'Error:', error);

      if (!error) {
        // Reload progress immediately
        await loadUserProgress(user.id);
      }
    } else {
      console.log('Existing progress found:', existingProgress);
    }
  };

  const getUserTutorialProgress = (tutorialId: string): UserTutorialProgress | null => {
    return userProgress.find(p => p.tutorialId === tutorialId) || null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      login, 
      register, 
      resetPassword,
      logout, 
      isLoading, 
      userProgress,
      markTutorialAsCompleted,
      startTutorial,
      getUserTutorialProgress
    }}>
      {children}
    </AuthContext.Provider>
  );
};
