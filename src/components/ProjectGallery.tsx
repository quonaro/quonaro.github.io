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
        <section className="w-full bg-background py-8 overflow-hidden">
            <div className="container mx-auto px-4 mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">{t('projects.title')}</h2>
                <ProjectsDialog />
            </div>

            {/* Container with 'group' to handle sibling dampening effect */}
            <div className="flex h-[400px] sm:h-[500px] w-full max-w-[1600px] mx-auto px-2 sm:px-4 gap-2 group">
                {galleryProjects.map((project) => (
                    <GalleryCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
};

export default ProjectGallery;
