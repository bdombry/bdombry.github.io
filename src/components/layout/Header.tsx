
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { BookOpen, User, LogOut, Settings, Shield } from 'lucide-react';

const Header: React.FC = () => {
  const { user, session, logout } = useAuth();
  const location = useLocation();

  // Debug logs
  console.log('Header - User state:', user);
  console.log('Header - User exists:', !!user);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">TutorHub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-gray-700'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/tutorials"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/tutorials') ? 'text-primary' : 'text-gray-700'
              }`}
            >
              Tutoriels
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/dashboard') ? 'text-primary' : 'text-gray-700'
                }`}
              >
                Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/admin') ? 'text-primary' : 'text-gray-700'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 h-8 w-auto px-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:inline-block">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        Administration
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {/* Si on a une session mais pas de profil utilisateur, on affiche quand même le bouton de déconnexion */}
                {session && !user && (
                  <Button variant="ghost" size="sm" onClick={logout} title="Se déconnecter">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                )}
                {!session && (
                  <div className="flex items-center space-x-2">
                    <Link to="/login">
                      <Button variant="ghost" size="sm">
                        Connexion
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="sm">
                        Inscription
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
