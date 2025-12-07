import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation, Trans } from 'react-i18next';
import { Snowflake, X } from "lucide-react";

const HeroSection = () => {
  const { t } = useTranslation();
  const [snowEnabled, setSnowEnabled] = useState(() => {
    const saved = localStorage.getItem('snowEnabled');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('snowEnabled', String(snowEnabled));
  }, [snowEnabled]);
  
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      </div>
      
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Terminal-style greeting */}
        <div className="font-mono text-terminal text-sm mb-8 opacity-75 animate-fade-in-down">
          <span className="text-muted-foreground">{t('hero.greeting')}</span>
        </div>
        
        {/* Main content */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
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
      
      {/* Toggle snow button */}
      <button
        onClick={() => setSnowEnabled(!snowEnabled)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-surface/80 backdrop-blur-sm border border-subtle rounded-full hover:border-primary/30 transition-smooth hover:scale-110 text-muted-foreground hover:text-foreground"
        aria-label={snowEnabled ? "Disable snow" : "Enable snow"}
        title={snowEnabled ? "Disable snow" : "Enable snow"}
      >
        {snowEnabled ? (
          <Snowflake className="w-5 h-5" />
        ) : (
          <X className="w-5 h-5" />
        )}
      </button>

      {/* Snow effect - floating particles */}
      {snowEnabled && Array.from({ length: 1000 }).map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const duration = 2 + Math.random() * 40; // 2-42 seconds (экстремальная вариативность)
        const delay = Math.random() * 15; // 0-15 seconds (максимальный разброс)
        const drift = (Math.random() - 0.5) * 300; // -150px to 150px (экстремальный дрейф)
        const size = Math.random() * 6 + 0.1; // 0.1-6.1px (экстремальная вариативность размеров)
        const opacity = Math.random() * 0.85 + 0.05; // 0.05-0.9 (максимальный диапазон прозрачности)
        const colors = [
          'bg-primary/50',
          'bg-secondary/50',
          'bg-terminal/50',
          'bg-primary/40',
          'bg-secondary/40',
          'bg-terminal/40',
          'bg-primary/30',
          'bg-secondary/30',
          'bg-terminal/30',
          'bg-primary/20',
          'bg-secondary/20',
          'bg-terminal/20',
          'bg-primary/15',
          'bg-secondary/15',
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <div
            key={i}
            className={`hidden sm:block absolute top-0 ${color} rounded-full animate-snow pointer-events-none`}
            style={{
              left,
              width: `${size}px`,
              height: `${size}px`,
              '--snow-duration': `${duration}s`,
              '--snow-drift': `${drift}px`,
              animationDelay: `${delay}s`,
              opacity,
            } as React.CSSProperties}
          />
        );
      })}
    </section>
  );
};

export default HeroSection;