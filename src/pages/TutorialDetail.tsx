import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tutorial } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Clock, Calendar, User, Play, BookOpen, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const TutorialDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, markTutorialAsCompleted, startTutorial, getUserTutorialProgress } = useAuth();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTutorial();
  }, [slug]);

  const loadTutorial = async () => {
    if (!slug) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('tutorials')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          description
        )
      `)
      .eq('slug', slug)
      .single();

    if (data && !error) {
      const formattedTutorial: Tutorial = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        videoUrl: data.video_url,
        category: data.categories || { id: '', name: 'Sans catégorie', slug: 'sans-categorie' },
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        duration: data.duration,
        difficulty: data.difficulty,
        tags: data.tags || []
      };
      setTutorial(formattedTutorial);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    if (tutorial && user) {
      startTutorial(tutorial.id);
    }
  }, [tutorial, user, startTutorial]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tutoriel non trouvé</h1>
          <p className="text-gray-600 mb-8">Le tutoriel que vous recherchez n'existe pas.</p>
          <Link to="/tutorials">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux tutoriels
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = user ? getUserTutorialProgress(tutorial.id) : null;
  const isCompleted = progress?.status === 'completed';

  const handleMarkAsCompleted = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour marquer ce tutoriel comme terminé');
      return;
    }

    markTutorialAsCompleted(tutorial.id);
    toast.success('Tutoriel marqué comme terminé ! 🎉');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/tutorials">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux tutoriels
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={getDifficultyColor(tutorial.difficulty)}>
              {tutorial.difficulty === 'beginner' && 'Débutant'}
              {tutorial.difficulty === 'intermediate' && 'Intermédiaire'}
              {tutorial.difficulty === 'advanced' && 'Avancé'}
            </Badge>
            <Badge variant="outline">
              {tutorial.category.name}
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Terminé
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {tutorial.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            {tutorial.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{tutorial.duration} minutes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Publié le {formatDate(tutorial.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>Tutoriel</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tutorial.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Video */}
        {tutorial.videoUrl && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Play className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Vidéo du tutoriel</h2>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={tutorial.videoUrl}
                  title={tutorial.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-gray-900">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-semibold mb-3 text-gray-900 mt-8">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-semibold mb-2 text-gray-900 mt-6">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700">{children}</li>,
                  code: ({ children, className }) => {
                    const isBlock = className?.includes('language-');
                    if (isBlock) {
                      return (
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                          <code>{children}</code>
                        </pre>
                      );
                    }
                    return (
                      <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                        {children}
                      </code>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 py-2 bg-gray-50 rounded-r mb-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {tutorial.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link to="/tutorials">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux tutoriels
            </Button>
          </Link>
          {user && (
            <Button 
              onClick={handleMarkAsCompleted}
              disabled={isCompleted}
              className={isCompleted ? 'bg-green-600 hover:bg-green-600' : ''}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Terminé
                </>
              ) : (
                'Marquer comme terminé'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialDetail;
