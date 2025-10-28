import { Code, Cpu, Zap, RefreshCw } from "lucide-react";
import { useTranslation } from 'react-i18next';

const ServicesSection = () => {
  const { t } = useTranslation();
  
  const services = [
    {
      icon: <Code className="w-6 h-6" />,
      title: t('services.fullStack.title'),
      description: t('services.fullStack.description'),
      technologies: ["FastAPI", "Vue 3", "TypeScript", "PostgreSQL"]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('services.ai.title'),
      description: t('services.ai.description'),
      technologies: ["Code Generation", "Automated Testing", "Documentation"]
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: t('services.legacy.title'),
      description: t('services.legacy.description'),
      technologies: ["Migration", "Refactoring", "API Design"]
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: t('services.performance.title'),
      description: t('services.performance.description'),
      technologies: ["Rust", "Performance", "Architecture"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('services.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="bg-surface/80 backdrop-blur-sm p-8 rounded-xl border border-subtle hover:border-primary/30 transition-smooth group hover:shadow-subtle"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-smooth">
                  {service.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-smooth">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 bg-muted/50 text-muted-foreground rounded-md font-mono border border-subtle"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Value proposition */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-surface p-6 rounded-xl border border-subtle max-w-2xl">
            <p className="text-foreground font-medium mb-2">
              {t('services.quote.text')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('services.quote.subtext')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;