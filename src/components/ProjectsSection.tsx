import { ExternalLink, Github } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface Project {
  name: string;
  description: string;
  url: string;
  githubUrl?: string;
  icon?: string; // Можно использовать emoji или название иконки
  technologies: string[];
}

const ProjectsSection = () => {
  const { t } = useTranslation();
  
  // Здесь вы будете добавлять свои проекты
  const projects: Project[] = [
    {
      name: "Specula",
      description: "Веб-приложение Specula",
      url: "https://quonaro.github.io/Specula",
      githubUrl: "https://github.com/quonaro/Specula",
      icon: "🔭",
      technologies: [],
    },
  ];

  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('projects.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.name}
              className="bg-surface/80 backdrop-blur-sm p-6 rounded-xl border border-subtle hover:border-primary/30 transition-smooth group hover:shadow-subtle flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header with icon and links */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {project.icon && (
                    <div className="text-2xl">{project.icon}</div>
                  )}
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-smooth">
                    {project.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-smooth"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-smooth"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-4 flex-1">
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

