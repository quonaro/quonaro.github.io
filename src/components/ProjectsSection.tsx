import { ExternalLink, Github, BookOpen } from "lucide-react";
import { useTranslation } from 'react-i18next';

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
  
  // Здесь вы будете добавлять свои проекты
  const projects: Project[] = [
    {
      name: t('projects.items.specula.name'),
      description: t('projects.items.specula.description'),
      url: "https://quonaro.github.io/Specula",
      githubUrl: "https://github.com/quonaro/Specula",
      icon: "🔭",
      technologies: [],
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
      technologies: ["Electron", "Vue.js", "SQLite"],
    },
    {
      name: t('projects.items.fias.name'),
      description: t('projects.items.fias.description'),
      url: "https://github.com/quonaro/fias-public-api",
      githubUrl: "https://github.com/quonaro/fias-public-api",
      icon: "🏠",
      technologies: [],
    },
  ];

  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
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
              className="bg-surface/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-subtle hover:border-primary/30 transition-smooth group hover:shadow-subtle flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header with icon and links */}
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  {project.icon && (
                    <div className="text-xl sm:text-2xl flex-shrink-0">{project.icon}</div>
                  )}
                  <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-smooth break-words">
                    {project.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-smooth p-1"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="GitHub repository"
                    >
                      <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  )}
                  {project.docsUrl && (
                    <a
                      href={project.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-secondary transition-smooth p-1"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Documentation"
                    >
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  )}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-smooth p-1"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Project link"
                  >
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 bg-muted/50 text-muted-foreground rounded-md font-mono border border-subtle"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

