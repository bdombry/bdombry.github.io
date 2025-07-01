
import { Tutorial, Category } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Développement Web',
    slug: 'developpement-web',
    description: 'Tutoriels sur le développement web moderne'
  },
  {
    id: '2',
    name: 'Design UI/UX',
    slug: 'design-ui-ux',
    description: 'Apprenez les bases du design d\'interface'
  },
  {
    id: '3',
    name: 'DevOps',
    slug: 'devops',
    description: 'Automatisation et déploiement'
  },
  {
    id: '4',
    name: 'Base de données',
    slug: 'base-de-donnees',
    description: 'Gestion et optimisation des données'
  }
];

export const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Introduction à React et TypeScript',
    slug: 'introduction-react-typescript',
    description: 'Apprenez les bases de React avec TypeScript pour créer des applications modernes.',
    content: `# Introduction à React et TypeScript

React est une bibliothèque JavaScript populaire pour construire des interfaces utilisateur. TypeScript ajoute un typage statique à JavaScript, ce qui améliore la qualité du code.

## Prérequis
- Connaissance de base en JavaScript
- Node.js installé sur votre machine

## Installation

\`\`\`bash
npx create-react-app mon-app --template typescript
cd mon-app
npm start
\`\`\`

## Premier composant

\`\`\`tsx
import React from 'react';

interface Props {
  name: string;
}

const Hello: React.FC<Props> = ({ name }) => {
  return <h1>Bonjour {name}!</h1>;
};

export default Hello;
\`\`\`

Cette approche vous permet de créer des composants robustes et maintenables.`,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: categories[0],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    duration: 45,
    difficulty: 'beginner',
    tags: ['React', 'TypeScript', 'Frontend']
  },
  {
    id: '2',
    title: 'Créer des API REST avec Node.js',
    slug: 'api-rest-nodejs',
    description: 'Construisez une API REST complète avec Node.js, Express et MongoDB.',
    content: `# Créer des API REST avec Node.js

Une API REST (Representational State Transfer) est un style d'architecture pour les services web.

## Configuration initiale

\`\`\`bash
npm init -y
npm install express mongoose dotenv
npm install -D nodemon @types/node
\`\`\`

## Structure du projet

\`\`\`
src/
  ├── controllers/
  ├── models/
  ├── routes/
  └── middleware/
\`\`\`

## Serveur de base

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Serveur démarré sur le port \${PORT}\`);
});
\`\`\``,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: categories[0],
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    duration: 60,
    difficulty: 'intermediate',
    tags: ['Node.js', 'Express', 'API', 'Backend']
  },
  {
    id: '3',
    title: 'Principes de Design UI/UX',
    slug: 'principes-design-ui-ux',
    description: 'Découvrez les fondamentaux du design d\'interface utilisateur et d\'expérience utilisateur.',
    content: `# Principes de Design UI/UX

Le design UI/UX est crucial pour créer des applications utilisables et attrayantes.

## Les 10 principes fondamentaux

### 1. Simplicité
Gardez votre interface simple et intuitive.

### 2. Consistance
Maintenez une cohérence visuelle et fonctionnelle.

### 3. Hiérarchie visuelle
Guidez l'œil de l'utilisateur avec une hiérarchie claire.

### 4. Contraste
Utilisez le contraste pour attirer l'attention.

### 5. Proximité
Groupez les éléments liés ensemble.

## Outils recommandés
- Figma
- Adobe XD
- Sketch
- InVision

## Ressources
- Material Design Guidelines
- Apple Human Interface Guidelines
- Nielsen Norman Group`,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: categories[1],
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-08T09:15:00Z',
    duration: 35,
    difficulty: 'beginner',
    tags: ['Design', 'UI', 'UX', 'Interface']
  },
  {
    id: '4',
    title: 'Déploiement avec Docker et Kubernetes',
    slug: 'deploiement-docker-kubernetes',
    description: 'Apprenez à containeriser et déployer vos applications avec Docker et Kubernetes.',
    content: `# Déploiement avec Docker et Kubernetes

La containerisation révolutionne le déploiement d'applications.

## Docker

### Dockerfile basique

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

### Construction et exécution

\`\`\`bash
docker build -t mon-app .
docker run -p 3000:3000 mon-app
\`\`\`

## Kubernetes

### Deployment YAML

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mon-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mon-app
  template:
    metadata:
      labels:
        app: mon-app
    spec:
      containers:
      - name: mon-app
        image: mon-app:latest
        ports:
        - containerPort: 3000
\`\`\`

### Commandes utiles

\`\`\`bash
kubectl apply -f deployment.yaml
kubectl get pods
kubectl logs -f <pod-name>
\`\`\``,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: categories[2],
    createdAt: '2024-01-05T16:45:00Z',
    updatedAt: '2024-01-05T16:45:00Z',
    duration: 75,
    difficulty: 'advanced',
    tags: ['Docker', 'Kubernetes', 'DevOps', 'Déploiement']
  },
  {
    id: '5',
    title: 'Optimisation des requêtes SQL',
    slug: 'optimisation-requetes-sql',
    description: 'Techniques avancées pour optimiser les performances de vos requêtes SQL.',
    content: `# Optimisation des requêtes SQL

L'optimisation des requêtes est cruciale pour les performances d'une application.

## Index

### Création d'index

\`\`\`sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_order_date ON orders(created_at);
\`\`\`

### Index composé

\`\`\`sql
CREATE INDEX idx_user_status_date ON users(status, created_at);
\`\`\`

## Optimisation des jointures

### INNER JOIN optimisé

\`\`\`sql
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND o.created_at >= '2024-01-01';
\`\`\`

## Analyse des performances

### EXPLAIN PLAN

\`\`\`sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
\`\`\`

## Bonnes pratiques

1. Utilisez des index appropriés
2. Évitez SELECT *
3. Limitez les résultats avec LIMIT
4. Utilisez WHERE au lieu de HAVING quand possible
5. Optimisez les sous-requêtes`,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: categories[3],
    createdAt: '2024-01-03T11:20:00Z',
    updatedAt: '2024-01-03T11:20:00Z',
    duration: 50,
    difficulty: 'advanced',
    tags: ['SQL', 'Database', 'Performance', 'Optimisation']
  }
];
