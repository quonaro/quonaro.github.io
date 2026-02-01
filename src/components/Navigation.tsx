import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Menu, LogOut } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const navItems = [
    { label: t('navigation.projects'), id: 'projects' },
    { label: t('navigation.skills'), id: 'skills' },
    { label: t('navigation.services'), id: 'services' },
    { label: t('navigation.contact'), id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    scrollToSection(id);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
    // Force refresh state since useAuth might not update immediately or just to be clean
    window.location.reload();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-smooth animate-fade-in-down ${isScrolled
      ? 'bg-background/95 backdrop-blur-md border-b border-subtle'
      : 'bg-transparent'
      }`}>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="https://github.com/quonaro"
            className="flex items-center gap-2 font-mono text-sm sm:text-lg font-semibold text-foreground hover:text-primary transition-smooth"
          >
            <img src="/logo.png" alt="quonaro logo" className="h-6 w-6 sm:h-8 sm:w-8 object-contain" />
            <span className="hidden sm:inline">quonaro.dev</span>
            <span className="sm:hidden">quonaro</span>
          </a>

          {/* Navigation items */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-sm text-muted-foreground hover:text-foreground transition-smooth relative group"
              >
                {item.label}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="text-sm text-muted-foreground hover:text-destructive transition-smooth relative group flex items-center gap-1"
                title={t('admin.dashboard.signOut', 'Sign Out')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-smooth">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="text-left text-lg text-muted-foreground hover:text-foreground transition-smooth py-2 border-b border-subtle flex items-center gap-2"
                    >
                      {item.label}
                    </button>
                  ))}
                  {isAuthenticated && (
                    <button
                      onClick={handleSignOut}
                      className="text-left text-lg text-muted-foreground hover:text-destructive transition-smooth py-2 border-b border-subtle flex items-center gap-2"
                    >
                      {t('admin.dashboard.signOut', 'Sign Out')} <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;