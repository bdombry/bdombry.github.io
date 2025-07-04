-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create enum for tutorial difficulty
CREATE TYPE public.tutorial_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create enum for tutorial status
CREATE TYPE public.tutorial_status AS ENUM ('not_started', 'in_progress', 'completed');

-- Create categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tutorials table
CREATE TABLE public.tutorials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  video_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  duration INTEGER, -- in minutes
  difficulty tutorial_difficulty DEFAULT 'beginner',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_tutorials table for progress tracking
CREATE TABLE public.user_tutorials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tutorial_id UUID REFERENCES public.tutorials(id) ON DELETE CASCADE,
  status tutorial_status DEFAULT 'not_started',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, tutorial_id)
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tutorials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert categories" ON public.categories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update categories" ON public.categories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete categories" ON public.categories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for tutorials (public read, admin write)
CREATE POLICY "Tutorials are viewable by everyone" ON public.tutorials
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert tutorials" ON public.tutorials
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update tutorials" ON public.tutorials
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete tutorials" ON public.tutorials
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for user_tutorials (users can only access their own)
CREATE POLICY "Users can view their own tutorial progress" ON public.user_tutorials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tutorial progress" ON public.user_tutorials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tutorial progress" ON public.user_tutorials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tutorial progress" ON public.user_tutorials
  FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_tutorials_updated_at
  BEFORE UPDATE ON public.tutorials
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Développement Web', 'developpement-web', 'Tutoriels sur le développement web moderne'),
  ('JavaScript', 'javascript', 'Tout sur JavaScript et ses frameworks'),
  ('React', 'react', 'Développement d''applications avec React'),
  ('CSS', 'css', 'Styles et mise en page avec CSS'),
  ('Backend', 'backend', 'Développement côté serveur');

-- Insert sample tutorials
INSERT INTO public.tutorials (title, slug, description, content, category_id, difficulty, duration, tags) 
SELECT 
  'Introduction à React',
  'introduction-react',
  'Apprenez les bases de React, la bibliothèque JavaScript populaire pour construire des interfaces utilisateur.',
  '# Introduction à React

React est une bibliothèque JavaScript développée par Facebook pour construire des interfaces utilisateur. Dans ce tutoriel, nous allons explorer les concepts fondamentaux de React.

## Qu''est-ce que React ?

React est une bibliothèque qui permet de créer des composants réutilisables pour construire des interfaces utilisateur complexes...

## Installation

Pour commencer avec React, vous pouvez utiliser Create React App :

```bash
npx create-react-app my-app
cd my-app
npm start
```

## Votre premier composant

```jsx
function HelloWorld() {
  return <h1>Hello, World!</h1>;
}
```',
  c.id,
  'beginner',
  45,
  ARRAY['react', 'javascript', 'frontend']
FROM public.categories c WHERE c.slug = 'react'

UNION ALL

SELECT 
  'Maîtriser CSS Grid',
  'maitriser-css-grid',
  'Découvrez comment créer des mises en page complexes avec CSS Grid Layout.',
  '# Maîtriser CSS Grid

CSS Grid Layout est un système de mise en page bidimensionnel qui révolutionne la façon dont nous créons des layouts web.

## Introduction à Grid

CSS Grid vous permet de créer des mises en page complexes avec un contrôle précis sur le placement des éléments...

## Exemple basique

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```',
  c.id,
  'intermediate',
  60,
  ARRAY['css', 'layout', 'design']
FROM public.categories c WHERE c.slug = 'css'

UNION ALL

SELECT 
  'API REST avec Node.js',
  'api-rest-nodejs',
  'Construisez une API REST complète avec Node.js et Express.',
  '# API REST avec Node.js

Dans ce tutoriel, nous allons construire une API REST complète en utilisant Node.js et Express.

## Configuration du projet

Commençons par initialiser notre projet Node.js :

```bash
npm init -y
npm install express cors helmet morgan
```

## Création du serveur

```javascript
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/users", (req, res) => {
  res.json({ message: "Liste des utilisateurs" });
});

app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});
```',
  c.id,
  'intermediate',
  90,
  ARRAY['nodejs', 'express', 'api', 'backend']
FROM public.categories c WHERE c.slug = 'backend';