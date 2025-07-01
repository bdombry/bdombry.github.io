
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
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
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<UserTutorialProgress[]>([]);

  useEffect(() => {
    // Simuler la vérification de session au démarrage
    const storedUser = localStorage.getItem('user');
    const storedProgress = localStorage.getItem('userProgress');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedProgress) {
      setUserProgress(JSON.parse(storedProgress));
    }
    setIsLoading(false);
  }, []);

  // Sauvegarder le progrès dans localStorage quand il change
  useEffect(() => {
    if (userProgress.length > 0) {
      localStorage.setItem('userProgress', JSON.stringify(userProgress));
    }
  }, [userProgress]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulation d'authentification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Benjamin Dombry comme admin
    if (email === 'benjamin.dombry@admin.com' && password === 'admin123') {
      const adminUser = {
        id: '1',
        email: 'benjamin.dombry@admin.com',
        name: 'Benjamin Dombry',
        role: 'admin' as const
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    } else if (email === 'user@example.com' && password === 'user123') {
      const normalUser = {
        id: '2',
        email: 'user@example.com',
        name: 'Normal User',
        role: 'user' as const
      };
      setUser(normalUser);
      localStorage.setItem('user', JSON.stringify(normalUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulation d'inscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user' as const
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const markTutorialAsCompleted = (tutorialId: string) => {
    if (!user) return;

    setUserProgress(prev => {
      const existingProgress = prev.find(p => p.tutorialId === tutorialId);
      
      if (existingProgress) {
        return prev.map(p => 
          p.tutorialId === tutorialId 
            ? { ...p, status: 'completed' as const, progress: 100, completedAt: new Date().toISOString() }
            : p
        );
      } else {
        return [
          ...prev,
          {
            tutorialId,
            status: 'completed' as const,
            progress: 100,
            completedAt: new Date().toISOString(),
            startedAt: new Date().toISOString()
          }
        ];
      }
    });
  };

  const startTutorial = (tutorialId: string) => {
    if (!user) return;

    setUserProgress(prev => {
      const existingProgress = prev.find(p => p.tutorialId === tutorialId);
      
      if (!existingProgress) {
        return [
          ...prev,
          {
            tutorialId,
            status: 'in_progress' as const,
            progress: 0,
            startedAt: new Date().toISOString()
          }
        ];
      }
      return prev;
    });
  };

  const getUserTutorialProgress = (tutorialId: string): UserTutorialProgress | null => {
    return userProgress.find(p => p.tutorialId === tutorialId) || null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
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
