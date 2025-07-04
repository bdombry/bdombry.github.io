
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tutorial } from '../types';
import TutorialCard from '../components/tutorials/TutorialCard';
import { Button } from '../components/ui/button';
import { BookOpen, Users, Award, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTutorials();
  }, []);

  const loadTutorials = async () => {
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
      .order('created_at', { ascending: false })
      .limit(3);

    if (data && !error) {
      const formattedTutorials: Tutorial[] = data.map(tutorial => ({
        id: tutorial.id,
        title: tutorial.title,
        slug: tutorial.slug,
        description: tutorial.description,
        content: tutorial.content,
        videoUrl: tutorial.video_url,
        category: tutorial.categories || { id: '', name: 'Sans catégorie', slug: 'sans-categorie' },
        createdAt: tutorial.created_at,
        updatedAt: tutorial.updated_at,
        duration: tutorial.duration,
        difficulty: tutorial.difficulty,
        tags: tutorial.tags || []
      }));
      setTutorials(formattedTutorials);
    }
    setIsLoading(false);
  };

  const latestTutorials = tutorials.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Apprenez le développement
              <span className="text-primary block">avec TutorHub</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez une collection de tutoriels gratuits pour maîtriser le développement web, 
              le design UI/UX et les technologies modernes. Projet pédagogique sans objectifs commerciaux.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tutorials">
                <Button size="lg" className="w-full sm:w-auto">
                  Parcourir les tutoriels
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Créer un compte gratuit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{tutorials.length}+</h3>
              <p className="text-gray-600">Tutoriels disponibles</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Étudiants actifs</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Taux de satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Tutorials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Derniers tutoriels
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos derniers contenus pour rester à jour
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : (
              latestTutorials.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))
            )}
          </div>

          <div className="text-center">
            <Link to="/tutorials">
              <Button size="lg" variant="outline">
                Voir tous les tutoriels
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer votre apprentissage ?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté d'apprenants et accédez à tous nos tutoriels gratuitement.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Créer mon compte
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
