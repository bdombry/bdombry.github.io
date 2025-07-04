
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface TutorialFormProps {
  tutorial?: any;
  onClose: () => void;
}

const TutorialForm: React.FC<TutorialFormProps> = ({ tutorial, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    videoUrl: '',
    category: '',
    difficulty: 'beginner',
    duration: '',
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (data) {
      setCategories(data);
    }
  };

  useEffect(() => {
    if (tutorial) {
      setFormData({
        title: tutorial.title || '',
        slug: tutorial.slug || '',
        description: tutorial.description || '',
        content: tutorial.content || '',
        videoUrl: tutorial.videoUrl || '',
        category: tutorial.category?.id || '',
        difficulty: tutorial.difficulty || 'beginner',
        duration: tutorial.duration?.toString() || '',
        tags: tutorial.tags || []
      });
    }
  }, [tutorial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-générer le slug depuis le titre
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.content || !formData.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);

    try {
      const tutorialData = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        video_url: formData.videoUrl || null,
        category_id: formData.category,
        difficulty: formData.difficulty as 'beginner' | 'intermediate' | 'advanced',
        duration: formData.duration ? parseInt(formData.duration) : null,
        tags: formData.tags
      };

      if (tutorial) {
        // Update existing tutorial
        const { error } = await supabase
          .from('tutorials')
          .update(tutorialData)
          .eq('id', tutorial.id);

        if (error) throw error;
        toast.success('Tutoriel modifié avec succès !');
      } else {
        // Create new tutorial
        const { error } = await supabase
          .from('tutorials')
          .insert(tutorialData);

        if (error) throw error;
        toast.success('Tutoriel créé avec succès !');
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving tutorial:', error);
      toast.error('Erreur lors de la sauvegarde du tutoriel');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Titre */}
        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Introduction à React"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="introduction-react"
            required
          />
        </div>

        {/* Catégorie */}
        <div>
          <Label htmlFor="category">Catégorie *</Label>
          <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulté */}
        <div>
          <Label htmlFor="difficulty">Difficulté</Label>
          <Select value={formData.difficulty} onValueChange={(value) => handleSelectChange('difficulty', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Débutant</SelectItem>
              <SelectItem value="intermediate">Intermédiaire</SelectItem>
              <SelectItem value="advanced">Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Durée */}
        <div>
          <Label htmlFor="duration">Durée (minutes)</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            placeholder="30"
          />
        </div>

        {/* URL Vidéo */}
        <div>
          <Label htmlFor="videoUrl">URL de la vidéo</Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Décrivez brièvement le contenu du tutoriel..."
          rows={3}
          required
        />
      </div>

      {/* Tags */}
      <div>
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Ajouter un tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div>
        <Label htmlFor="content">Contenu (Markdown) *</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Rédigez le contenu du tutoriel en Markdown..."
          rows={15}
          required
          className="font-mono text-sm"
        />
        <p className="text-sm text-gray-500 mt-1">
          Vous pouvez utiliser la syntaxe Markdown (titres, listes, liens, code, etc.)
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Sauvegarde...' : tutorial ? 'Modifier' : 'Créer'} le tutoriel
        </Button>
      </div>
    </form>
  );
};

export default TutorialForm;
