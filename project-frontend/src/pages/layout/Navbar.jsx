import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, Layout, Package, LogOut, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                   ${isActive 
                     ? 'text-blue-600 bg-blue-50 font-medium' 
                     : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
      >
        <Icon className="w-4 h-4" />
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                    ${isScrolled 
                      ? 'bg-white/80 backdrop-blur-md shadow-lg' 
                      : 'bg-white'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-blue-600 font-bold text-xl
                       transform transition-transform duration-200 hover:scale-105"
          >
            <Layout className="w-6 h-6" />
            <span className="hidden sm:inline">Mobile Bill System</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                <NavLink to={user.role === "user" ? "/dashboard" : "/admin"} icon={Home}>
                  {user.role === "user" ? "Dashboard" : "Admin"}
                </NavLink>
                <NavLink to="/plans" icon={Package}>Plans</NavLink>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">{user.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2 hover:border-blue-500"
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                             transform transition-transform duration-200 hover:scale-105"
                  >
                    <User className="w-4 h-4" />
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out
                      ${isMobileMenuOpen 
                        ? 'max-h-screen opacity-100' 
                        : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="px-4 py-3 space-y-2 bg-gray-50 border-t">
          {user ? (
            <>
              <NavLink to={user.role === "user" ? "/dashboard" : "/admin"} icon={Home}>
                {user.role === "user" ? "Dashboard" : "Admin"}
              </NavLink>
              <NavLink to="/plans" icon={Package}>Plans</NavLink>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">{user.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 border-red-200 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <User className="w-4 h-4" />
                  Login
                </Button>
              </Link>
              <Link to="/register" className="block">
                <Button className="w-full flex items-center justify-center gap-2 bg-blue-600">
                  <User className="w-4 h-4" />
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;