import { Button } from "@/components/ui/button";
import { useTranslation, Trans } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-hero relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      </div>
      
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Terminal-style greeting */}
        <div className="font-mono text-terminal text-sm mb-8 opacity-75">
          <span className="text-muted-foreground">{t('hero.greeting')}</span>
        </div>
        
        {/* Main content */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-foreground">{t('hero.name')}</span>
          </h1>
          
          <div className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium">
            {t('hero.title')}
          </div>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
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
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-mono bg-surface/50 backdrop-blur-sm border border-subtle rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/30 transition-smooth"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {tech}
              </span>
            ))}
          </div>
          
          {/* CTA */}
          <div className="pt-8">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group"
            >
              <span>{t('hero.startProject')}</span>
              <div className="ml-2 transition-transform group-hover:translate-x-1">→</div>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="hidden sm:block absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full animate-pulse" />
      <div className="hidden sm:block absolute bottom-1/4 right-16 w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="hidden sm:block absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-terminal rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default HeroSection;