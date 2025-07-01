
export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  videoUrl?: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface UserTutorial {
  id: string;
  userId: string;
  tutorialId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  completedAt?: string;
  startedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}
