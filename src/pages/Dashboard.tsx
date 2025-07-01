
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tutorials } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Simulation de données utilisateur
  const userStats = {
    tutorialsCompleted: 3,
    tutorialsInProgress: 2,
    totalTimeSpent: 240, // minutes
    currentStreak: 5
  };

  const recentTutorials = tutorials.slice(0, 3);
  const inProgressTutorials = [
    { ...tutorials[0], progress: 75 },
    { ...tutorials[1], progress: 30 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user?.name} ! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Continuez votre apprentissage où vous vous êtes arrêté
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tutoriels terminés</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.tutorialsCompleted}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En cours</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.tutorialsInProgress}</p>
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
                  <p className="text-sm font-medium text-gray-600">Temps d'étude</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(userStats.totalTimeSpent / 60)}h {userStats.totalTimeSpent % 60}m</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Série actuelle</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.currentStreak} jours</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tutoriels en cours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Continuer l'apprentissage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inProgressTutorials.map((tutorial) => (
                  <div key={tutorial.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{tutorial.title}</h3>
                      <Badge variant="outline">{tutorial.category.name}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">{tutorial.progress}% terminé</span>
                      <span className="text-sm text-gray-500">{tutorial.duration} min</span>
                    </div>
                    <Progress value={tutorial.progress} className="mb-3" />
                    <Link to={`/tutorials/${tutorial.slug}`}>
                      <Button size="sm" className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Continuer
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nouveaux tutoriels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Nouveaux tutoriels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTutorials.map((tutorial) => (
                  <div key={tutorial.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{tutorial.title}</h3>
                      <Badge variant="outline">{tutorial.category.name}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {tutorial.duration} min
                        </span>
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
                      </div>
                    </div>
                    <Link to={`/tutorials/${tutorial.slug}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        Commencer
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/tutorials">
                  <Button variant="outline" className="w-full h-16 flex-col">
                    <BookOpen className="h-6 w-6 mb-2" />
                    Parcourir les tutoriels
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" className="w-full h-16 flex-col">
                    <Award className="h-6 w-6 mb-2" />
                    Mon profil
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-16 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Mes statistiques
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
