import { useTranslation } from 'react-i18next';
import { Project } from '@/types/project';
import { cn } from '@/lib/utils';

interface ProjectCoverProps {
    project: Project;
    className?: string;
}

export const ProjectCover = ({ project, className }: ProjectCoverProps) => {
    const { i18n } = useTranslation();
    const currentLang = (i18n.language || 'en').split('-')[0] as 'en' | 'ru';

    const config = project.cover_config;
    const isGenerated = config?.type === 'generated';

    if (isGenerated && config?.gradient) {
        const text = config.text?.[currentLang] || project.name[currentLang];

        return (
            <div
                className={cn(
                    "w-full h-full flex flex-col items-center justify-center p-6 text-center",
                    config.gradient,
                    className
                )}
            >
                <h3
                    className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-tight leading-tight"
                    style={{
                        fontSize: config.fontSize ? `${config.fontSize}px` : undefined,
                        fontWeight: config.fontWeight || 900,
                        fontFamily: config.fontFamily === 'Golos' ? "'Golos Text', sans-serif" :
                            config.fontFamily === 'Inter' ? "'Inter', sans-serif" : undefined
                    }}
                >
                    {text}
                </h3>
                {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-4 opacity-80">
                        {project.technologies.slice(0, 3).map(tech => (
                            <span key={tech} className="text-[10px] font-bold px-2 py-0.5 bg-black/20 text-white rounded-full backdrop-blur-sm border border-white/10 uppercase tracking-widest">
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <img
            src={project.cover_image}
            alt={project.name[currentLang]}
            className={cn("w-full h-full object-cover", className)}
        />
    );
};
