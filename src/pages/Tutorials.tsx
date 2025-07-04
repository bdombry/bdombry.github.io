
import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tutorial, Category } from '../types';
import TutorialCard from '../components/tutorials/TutorialCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

const Tutorials: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tutorialsPerPage = 6;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    
    // Load categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    // Load tutorials
    const { data: tutorialsData } = await supabase
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
      .order('created_at', { ascending: false });

    if (categoriesData) {
      setCategories(categoriesData);
    }

    if (tutorialsData) {
      const formattedTutorials: Tutorial[] = tutorialsData.map(tutorial => ({
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

  const filteredTutorials = useMemo(() => {
    return tutorials.filter(tutorial => {
      const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || tutorial.category.id === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || tutorial.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const totalPages = Math.ceil(filteredTutorials.length / tutorialsPerPage);
  const startIndex = (currentPage - 1) * tutorialsPerPage;
  const currentTutorials = filteredTutorials.slice(startIndex, startIndex + tutorialsPerPage);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tous les tutoriels
          </h1>
          <p className="text-xl text-gray-600">
            Explorez notre collection complète de tutoriels
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un tutoriel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Toutes les catégories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedDifficulty === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(null)}
              >
                Tout niveau
              </Button>
              <Button
                variant={selectedDifficulty === 'beginner' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty('beginner')}
              >
                Débutant
              </Button>
              <Button
                variant={selectedDifficulty === 'intermediate' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty('intermediate')}
              >
                Intermédiaire
              </Button>
              <Button
                variant={selectedDifficulty === 'advanced' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty('advanced')}
              >
                Avancé
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-4 border-t">
              <span className="text-sm text-gray-500">Filtres actifs:</span>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Recherche: "{searchTerm}"
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {categories.find(c => c.id === selectedCategory)?.name}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
                  </Badge>
                )}
                {selectedDifficulty && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedDifficulty === 'beginner' && 'Débutant'}
                    {selectedDifficulty === 'intermediate' && 'Intermédiaire'}
                    {selectedDifficulty === 'advanced' && 'Avancé'}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedDifficulty(null)} />
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Effacer tout
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredTutorials.length} tutoriel{filteredTutorials.length > 1 ? 's' : ''} trouvé{filteredTutorials.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Tutorials Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : currentTutorials.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {currentTutorials.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Aucun tutoriel trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <Button onClick={clearFilters}>
              Effacer les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorials;
