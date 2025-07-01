
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirection vers la page d'accueil principale
  return <Navigate to="/" replace />;
};

export default Index;
