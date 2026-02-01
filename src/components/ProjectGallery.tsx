import { useTranslation } from 'react-i18next';
import { useProjects } from '@/hooks/useProjects';
import { Button } from './ui/button';
import { ProjectsDialog } from './ProjectsDialog';
import { GalleryCard } from './GalleryCard';

const ProjectGallery = () => {
    const { t } = useTranslation();
    const { projects } = useProjects();

    // Show top 4 projects (with or without media)
    const galleryProjects = projects.slice(0, 4);

    if (projects.length === 0) return null;

    return (
        <section className="w-full bg-background py-12 sm:py-16 md:py-20 overflow-hidden">
            <div className="container mx-auto px-4 mb-10 sm:mb-12 md:mb-16 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
                    {t('projects.title')}
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
                    {t('projects.subtitle')}
                </p>
            </div>

            {/* Container with 'group' to handle sibling dampening effect */}
            <div className="flex h-[400px] sm:h-[500px] w-full max-w-[1600px] mx-auto px-2 sm:px-4 gap-2 group">
                {galleryProjects.map((project) => (
                    <GalleryCard key={project.id} project={project} />
                ))}
            </div>

            <div className="container mx-auto px-4 mt-8 sm:mt-12 text-center">
                <ProjectsDialog />
            </div>
        </section>
    );
};

export default ProjectGallery;
