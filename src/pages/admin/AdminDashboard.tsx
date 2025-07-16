
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tutorial } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Edit, Trash2, Users, BookOpen, TrendingUp, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import TutorialForm from '../../components/admin/TutorialForm';
import CategoryForm from '../../components/admin/CategoryForm';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalTutorials: 0,
    totalUsers: 0,
    completedTutorials: 0,
    averageRating: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
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

    // Load categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    // Load stats
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('id');

    const { data: completionsData } = await supabase
      .from('user_tutorials')
      .select('id')
      .eq('status', 'completed');

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

    if (categoriesData) {
      setCategories(categoriesData);
    }

    setStats({
      totalTutorials: tutorialsData?.length || 0,
      totalUsers: profilesData?.length || 0,
      completedTutorials: completionsData?.length || 0,
      averageRating: 4.6 // Placeholder
    });

    setIsLoading(false);
  };

  // Vérification des droits admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les droits d'accès à cette section.</p>
          <Link to="/" className="text-primary hover:underline mt-4 inline-block">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // Stats pour l'admin
  const handleEdit = (tutorial) => {
    setEditingTutorial(tutorial);
    setIsFormOpen(true);
  };

  const handleDelete = async (tutorialId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce tutoriel ?')) {
      const { error } = await supabase
        .from('tutorials')
        .delete()
        .eq('id', tutorialId);

      if (error) {
        toast.error('Erreur lors de la suppression du tutoriel');
      } else {
        toast.success('Tutoriel supprimé avec succès');
        loadDashboardData(); // Reload data
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTutorial(null);
    loadDashboardData(); // Reload data after form close
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) {
        toast.error('Erreur lors de la suppression de la catégorie');
      } else {
        toast.success('Catégorie supprimée avec succès');
        loadDashboardData(); // Reload data
      }
    }
  };

  const handleCategoryFormClose = () => {
    setIsCategoryFormOpen(false);
    setEditingCategory(null);
    loadDashboardData(); // Reload data after form close
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Administrateur
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue {user.name} ! Gérez vos tutoriels et utilisateurs.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tutoriels</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTutorials}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Complétions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedTutorials}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}/5</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Eye className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gestion des catégories */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gestion des catégories</CardTitle>
              <Dialog open={isCategoryFormOpen} onOpenChange={setIsCategoryFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingCategory(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle catégorie
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? 'Modifier la catégorie' : 'Créer une nouvelle catégorie'}
                    </DialogTitle>
                  </DialogHeader>
                  <CategoryForm 
                    category={editingCategory} 
                    onClose={handleCategoryFormClose}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-sm text-gray-600">{category.slug}</TableCell>
                      <TableCell className="text-sm">
                        {category.description ? 
                          (category.description.length > 50 ? 
                            category.description.substring(0, 50) + '...' : 
                            category.description
                          ) : 
                          '-'
                        }
                      </TableCell>
                      <TableCell>{new Date(category.created_at).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Gestion des tutoriels */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gestion des tutoriels</CardTitle>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingTutorial(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau tutoriel
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTutorial ? 'Modifier le tutoriel' : 'Créer un nouveau tutoriel'}
                    </DialogTitle>
                  </DialogHeader>
                  <TutorialForm 
                    tutorial={editingTutorial} 
                    onClose={handleFormClose}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Difficulté</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tutorials.map((tutorial) => (
                    <TableRow key={tutorial.id}>
                      <TableCell className="font-medium">{tutorial.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tutorial.category.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary"
                          className={
                            tutorial.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                            tutorial.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {tutorial.difficulty === 'beginner' && 'Débutant'}
                          {tutorial.difficulty === 'intermediate' && 'Intermédiaire'}
                          {tutorial.difficulty === 'advanced' && 'Avancé'}
                        </Badge>
                      </TableCell>
                      <TableCell>{tutorial.duration} min</TableCell>
                      <TableCell>{new Date(tutorial.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={`/tutorials/${tutorial.slug}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(tutorial)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(tutorial.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
