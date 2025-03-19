
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Mail, 
  User, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  PlusCircle 
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="h-4 w-4 mr-2" /> 
    },
    { 
      name: 'Create Test', 
      path: '/create-test', 
      icon: <PlusCircle className="h-4 w-4 mr-2" /> 
    }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass backdrop-blur-lg py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-primary font-medium text-lg"
        >
          <Mail className="h-6 w-6" />
          <span className="font-semibold">EmailTest</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {isAuthenticated && (
            <>
              <div className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center text-sm font-medium transition-colors hover:text-primary",
                      location.pathname === link.path 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    )}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground mr-2">
                  <span className="font-medium text-foreground">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === "/login" 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-hover text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-background/95 backdrop-blur-sm border-b border-border animate-slide-down">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center text-sm font-medium p-2 rounded-md transition-colors",
                      location.pathname === link.path 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-muted"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center text-sm font-medium p-2 rounded-md hover:bg-muted transition-colors w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center text-sm font-medium p-2 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center text-sm font-medium p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
