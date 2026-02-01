import { Code, Cpu, Zap, RefreshCw } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useInView } from "@/hooks/use-in-view";

const ServicesSection = () => {
  const { t } = useTranslation();
  const { ref: sectionRef, isInView: sectionInView } = useInView({ threshold: 0.1 });

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
    <section id="services" ref={sectionRef} className="py-12 sm:py-16 md:py-20" style={{ background: 'linear-gradient(to bottom, hsl(220 27% 6%), hsl(220 27% 5%))' }}>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-10 sm:mb-12 md:mb-16 transition-all duration-700 ${sectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            {t('services.title')}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`bg-surface/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-subtle hover:border-primary/30 transition-all duration-700 group hover:shadow-subtle hover:scale-[1.02] ${sectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 p-2 sm:p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-smooth">
                  <div className="w-5 h-5 sm:w-6 sm:h-6">{service.icon}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 group-hover:text-primary transition-smooth">
                    {service.title}
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
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
        <div className="mt-10 sm:mt-12 md:mt-16 text-center px-2 sm:px-0">
          <div className="inline-block bg-gradient-surface p-4 sm:p-6 rounded-xl border border-subtle max-w-2xl">
            <p className="text-sm sm:text-base text-foreground font-medium mb-2">
              {t('services.quote.text')}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('services.quote.subtext')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;