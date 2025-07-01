
import React from 'react';
import { Link } from 'react-router-dom';
import { Tutorial } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Calendar, User } from 'lucide-react';

interface TutorialCardProps {
  tutorial: Tutorial;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial }) => {
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
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge className={getDifficultyColor(tutorial.difficulty)}>
            {tutorial.difficulty === 'beginner' && 'Débutant'}
            {tutorial.difficulty === 'intermediate' && 'Intermédiaire'}
            {tutorial.difficulty === 'advanced' && 'Avancé'}
          </Badge>
          <Badge variant="outline">
            {tutorial.category.name}
          </Badge>
        </div>
        <CardTitle className="text-lg">
          <Link 
            to={`/tutorials/${tutorial.slug}`}
            className="hover:text-primary transition-colors"
          >
            {tutorial.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {tutorial.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{tutorial.duration} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(tutorial.createdAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {tutorial.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tutorial.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{tutorial.tags.length - 3}
            </Badge>
          )}
        </div>

        <Link 
          to={`/tutorials/${tutorial.slug}`}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm"
        >
          Lire la suite →
        </Link>
      </CardContent>
    </Card>
  );
};

export default TutorialCard;
