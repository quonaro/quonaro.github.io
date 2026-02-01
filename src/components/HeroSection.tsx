
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useTranslation, Trans } from 'react-i18next';
import { SecretTerminal } from './SecretTerminal';
import { useAuth } from '@/hooks/useAuth';

const HeroSection = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const handleGreetingClick = () => {
    setIsTerminalOpen(true);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      </div>

      <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Terminal-style greeting */}
        <div
          className="font-mono text-terminal text-sm mb-8 opacity-75 animate-fade-in-down cursor-pointer select-none active:scale-95 transition-transform"
          onClick={handleGreetingClick}
        >
          <span className={isAuthenticated ? "text-green-500 font-bold" : "text-muted-foreground"}>
            {isAuthenticated ? "$ admin" : t('hero.greeting')}
          </span>
        </div>

        {/* Main content */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="flex items-center justify-center gap-4 text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <img src="/logo.png" alt="quonaro logo" className="h-10 w-10 sm:h-14 sm:w-14 md:h-20 md:w-20 object-contain drop-shadow-xl" />
            <span className="text-foreground">{t('hero.name')}</span>
          </h1>

          <div className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            {t('hero.title')}
          </div>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <Trans
              i18nKey="hero.description"
              components={{
                fastapi: <span className="text-primary font-medium" />,
                vue3: <span className="text-secondary font-medium" />
              }}
            />
            <br />
            {t('hero.aiDescription')}
          </p>

          {/* Tech highlights */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 px-2 sm:px-0">
            {["FastAPI", "Vue 3", "TypeScript", "PostgreSQL", "Redis", "Rust"].map((tech, index) => (
              <span
                key={tech}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-mono bg-surface/50 backdrop-blur-sm border border-subtle rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/30 transition-smooth animate-scale-in hover:scale-105"
                style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: 'both' }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-8 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
            <Button
              variant="hero"
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group hover:scale-105 transition-transform"
            >
              <span>{t('hero.startProject')}</span>
              <div className="ml-2 transition-transform group-hover:translate-x-1">→</div>
            </Button>
          </div>
        </div>
      </div>

      <SecretTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      {/* Bottom fade to blend with next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[hsl(220,27%,8%)] pointer-events-none" />
    </section>
  );
};

export default HeroSection;