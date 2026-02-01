import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import { useInView } from "@/hooks/use-in-view";

const SkillsSection = () => {
  const { t } = useTranslation();
  const [showResult, setShowResult] = useState(false);
  const { ref: sectionRef, isInView: sectionInView } = useInView({ threshold: 0.1 });
  const skills = [
    {
      category: "Backend",
      technologies: [
        { name: "FastAPI", level: "Expert", primary: true },
        { name: "Python", level: "Expert" },
        { name: "PostgreSQL", level: "Advanced" },
        { name: "Redis", level: "Advanced" },
        { name: "Django/DRF", level: "Proficient" },
      ]
    },
    {
      category: "Frontend",
      technologies: [
        { name: "Vue 3", level: "Expert", primary: true },
        { name: "TypeScript", level: "Expert", primary: true },
        { name: "JavaScript", level: "Expert" },
        { name: "HTML/CSS", level: "Expert" },
        { name: "jQuery", level: "Proficient" },
      ]
    },
    {
      category: "Tools & Others",
      technologies: [
        { name: "AI-Augmented Dev", level: "Advanced", primary: true },
        { name: "Rust", level: "Learning", upcoming: true },
        { name: "Git", level: "Expert" },
        { name: "Docker", level: "Advanced" },
        { name: "Linux", level: "Advanced" },
      ]
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert": return "text-terminal";
      case "Advanced": return "text-primary";
      case "Proficient": return "text-secondary";
      case "Learning": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  return (
    <section id="skills" ref={sectionRef} className="py-12 sm:py-16 md:py-20" style={{ background: 'linear-gradient(to bottom, hsl(220 27% 7%), hsl(220 27% 6%))' }}>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-10 sm:mb-12 md:mb-16 transition-all duration-700 ${sectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            {t('skills.title')}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            {t('skills.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {skills.map((skillGroup, groupIndex) => (
            <div
              key={skillGroup.category}
              className={`bg-gradient-surface p-4 sm:p-6 rounded-xl border border-subtle hover:border-primary/20 transition-all duration-700 group hover:scale-[1.02] ${sectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${groupIndex * 150}ms` }}
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-foreground group-hover:text-primary transition-smooth">
                {skillGroup.category}
              </h3>

              <div className="space-y-4">
                {skillGroup.technologies.map((tech, techIndex) => (
                  <div key={tech.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs sm:text-sm font-medium ${tech.primary ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {tech.name}
                      </span>
                      {tech.primary && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      )}
                      {tech.upcoming && (
                        <span className="text-xs px-2 py-0.5 bg-secondary/20 text-secondary rounded-full font-mono">
                          upcoming
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-mono ${getLevelColor(tech.level)}`}>
                      {tech.level.toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Terminal-style command at bottom */}
        <div className="mt-10 sm:mt-12 md:mt-16 text-center px-2 sm:px-0">
          <div className="inline-block bg-surface/50 backdrop-blur-sm border border-subtle rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm text-muted-foreground max-w-full overflow-x-auto">
            <div className="flex items-center justify-center gap-2">
              <span className="text-terminal">$</span>
              <TypewriterText
                text={t('skills.terminalCommand')}
                speed={80}
                delay={1000}
                onComplete={() => {
                  setTimeout(() => setShowResult(true), 500);
                }}
              />
            </div>
            {showResult && (
              <div className="mt-2">
                <TypewriterText
                  text={t('skills.terminalResult')}
                  speed={60}
                  delay={200}
                  className="text-foreground"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;