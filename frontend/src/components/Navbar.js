import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Briefcase } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
         <nav className="nav-shell">
        
      <div className="container mx-auto px-4">
        <div className="nav-row h-20">
                     {/* Logo */}
           <Link to="/" className="brand">
             <div className="brand-logo">
               <Briefcase className="w-7 h-7 text-white" />
             </div>
             <span className="brand-title">TalentHub</span>
           </Link>

          {/* Desktop Navigation (hidden per user request) */}
          <div style={{display:'none'}} />

          {/* Right Corner Actions */}
          <div className="nav-right">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-primary nav-auth">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary nav-auth">
                Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="profile-btn"
                >
                  <User className="w-5 h-5" />
                  <span>{user?.name}</span>
                </button>
                {isMenuOpen && (
                  <div className="profile-menu">
                    <div className="profile-menu-meta">
                      {user?.role === 'employer' ? 'Employer' : 'Applicant'}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="profile-menu-item"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
