import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

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
    { label: t('navigation.skills'), id: 'skills' },
    { label: t('navigation.services'), id: 'services' },
    { label: t('navigation.projects'), id: 'projects' },
    { label: t('navigation.contact'), id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md border-b border-subtle' 
        : 'bg-transparent'
    }`}>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-sm sm:text-lg font-semibold text-foreground hover:text-primary transition-smooth"
          >
            <a href="https://github.com/quonaro">
              <span className="hidden sm:inline"><span className="text-terminal">$</span> quonaro.dev</span>
              <span className="sm:hidden"><span className="text-terminal">$</span> quonaro</span>
            </a>
          </button>

          {/* Navigation items */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm text-muted-foreground hover:text-foreground transition-smooth relative group"
              >
                {item.label}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            ))}
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
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-lg text-muted-foreground hover:text-foreground transition-smooth py-2 border-b border-subtle"
                    >
                      {item.label}
                    </button>
                  ))}
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