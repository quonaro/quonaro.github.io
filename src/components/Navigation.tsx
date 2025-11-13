import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { ChevronDown, ExternalLink } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useGitHubRepos } from '@/hooks/useGitHubRepos';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  const { repos, loading, error } = useGitHubRepos('quonaro', true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Формируем URL для GitHub Pages
  const getRepoUrl = (repo: { name: string; homepage: string | null }) => {
    if (repo.homepage) {
      return repo.homepage;
    }
    // Стандартный URL для GitHub Pages: username.github.io/repo-name
    return `https://quonaro.github.io/${repo.name}`;
  };

  const navItems = [
    { label: t('navigation.skills'), id: 'skills' },
    { label: t('navigation.services'), id: 'services' },
    { label: t('navigation.contact'), id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md border-b border-subtle' 
        : 'bg-transparent'
    }`}>
      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-lg font-semibold text-foreground hover:text-primary transition-smooth"
          >
            <a href="https://github.com/quonaro"><span className="text-terminal">$</span> quonaro.dev</a>
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
            
            {/* GitHub Repos Dropdown */}
            {(repos.length > 0 || loading) && (
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm text-muted-foreground hover:text-foreground transition-smooth relative group flex items-center gap-1">
                  {t('navigation.projects')}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 max-h-[400px] overflow-y-auto">
                  <DropdownMenuLabel>{t('navigation.projects')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {loading ? (
                    <DropdownMenuItem disabled>
                      {t('navigation.loading')}...
                    </DropdownMenuItem>
                  ) : error ? (
                    <DropdownMenuItem disabled className="text-destructive">
                      <div className="text-xs">{error}</div>
                    </DropdownMenuItem>
                  ) : repos.length === 0 ? (
                    <DropdownMenuItem disabled>
                      {t('navigation.noProjects')}
                    </DropdownMenuItem>
                  ) : (
                    repos.map((repo) => (
                      <DropdownMenuItem
                        key={repo.id}
                        className="flex items-start gap-2 cursor-pointer"
                        asChild
                      >
                        <a
                          href={getRepoUrl(repo)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{repo.name}</div>
                            {repo.description && (
                              <div className="text-xs text-muted-foreground truncate mt-0.5">
                                {repo.description}
                              </div>
                            )}
                          </div>
                          <ExternalLink className="h-3 w-3 opacity-50 flex-shrink-0 ml-2" />
                        </a>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-muted-foreground hover:text-foreground">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;