import { Github, ExternalLink } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";

interface Project {
  name: string;
  description: string;
  url: string;
  githubUrl?: string;
  docsUrl?: string;
  icon?: string; // Можно использовать emoji или название иконки
  technologies: string[];
}

const ProjectsSection = () => {
  const { t } = useTranslation();
  const { ref: sectionRef, isInView: sectionInView } = useInView({ threshold: 0.1 });
  
  // Здесь вы будете добавлять свои проекты
  const projects: Project[] = [
    {
      name: t('projects.items.specula.name'),
      description: t('projects.items.specula.description'),
      url: "https://quonaro.github.io/Specula",
      githubUrl: "https://github.com/quonaro/Specula",
      icon: "🔭",
      technologies: ["Vue.js 3"],
    },
    {
      name: t('projects.items.nest.name'),
      description: t('projects.items.nest.description'),
      url: "https://github.com/quonaro/Nest",
      githubUrl: "https://github.com/quonaro/Nest",
      docsUrl: "https://quonaro.github.io/Nest",
      icon: "🪺",
      technologies: ["Rust"],
    },
    {
      name: t('projects.items.safewheel.name'),
      description: t('projects.items.safewheel.description'),
      url: "https://github.com/quonaro/safe-wheel",
      githubUrl: "https://github.com/quonaro/safe-wheel",
      icon: "🚴",
      technologies: ["Electron", "Vue.js 3", "SQLite"],
    },
    {
      name: t('projects.items.fias.name'),
      description: t('projects.items.fias.description'),
      url: "https://github.com/quonaro/fias-public-api",
      githubUrl: "https://github.com/quonaro/fias-public-api",
      icon: "🏠",
      technologies: ["Python"],
    },
    {
      name: t('projects.items.keyschool.name'),
      description: t('projects.items.keyschool.description'),
      url: "https://quonaro.github.io/kwork-keyschool",
      githubUrl: "https://github.com/quonaro/kwork-keyschool",
      icon: "🎓",
      technologies: ["Vue.js 3", "Vite", "CSS3"],
    },
  ];

  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" ref={sectionRef} className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`text-center mb-10 sm:mb-12 md:mb-16 transition-all duration-700 ${sectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            {t('projects.title')}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
            {t('projects.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <div
              key={project.name}
              onClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
              className={`bg-surface/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-subtle hover:border-primary/30 transition-all duration-700 group hover:shadow-subtle flex flex-col cursor-pointer hover:scale-[1.02] ${sectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Header with icon */}
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                {project.icon && (
                  <div className="text-xl sm:text-2xl flex-shrink-0">{project.icon}</div>
                )}
                <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-smooth break-words">
                  {project.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 bg-muted/50 text-muted-foreground rounded-md font-mono border border-subtle"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-subtle">
                {project.githubUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="flex-1 min-w-0 text-xs sm:text-sm"
                  >
                    <Github className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                    {t('common.code')}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.docsUrl || project.url, '_blank', 'noopener,noreferrer');
                  }}
                  className="flex-1 min-w-0 text-xs sm:text-sm"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                  {t('common.demo')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

