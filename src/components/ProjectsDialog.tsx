import { Github, ExternalLink, Play, FileText, Download, Youtube, Figma, Book, Monitor } from "lucide-react";
import Fade from 'embla-carousel-fade';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useProjects } from "@/hooks/useProjects";
import { Project } from "@/types/project";

// const projects = projectsData as Project[]; // Removed

const ProjectCard = ({ project }: { project: Project }) => {
    const { t } = useTranslation();

    const hasMedia = project.media && project.media.length > 0;
    const firstMedia = hasMedia ? project.media![0] : null;

    return (
        <div
            onClick={() => window.open(project.links.demo || project.links.github, '_blank', 'noopener,noreferrer')}
            className="bg-surface/80 backdrop-blur-sm rounded-xl border border-subtle hover:border-primary/30 transition-all duration-300 group hover:shadow-subtle flex flex-col cursor-pointer overflow-hidden hover:scale-[1.01]"
        >
            {/* Media Preview Area */}
            {hasMedia ? (
                <div className="w-full h-40 sm:h-48 bg-black/20 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                    {project.media!.length > 1 ? (
                        <div onClick={(e) => e.stopPropagation()} className="h-full">
                            <Carousel className="w-full h-full" plugins={[Fade()]}>
                                <CarouselContent>
                                    {project.media!.map((media, index) => (
                                        <CarouselItem key={index}>
                                            <div className="w-full h-40 sm:h-48">
                                                {media.type === 'image' ? (
                                                    <img
                                                        src={media.url}
                                                        alt={`${project.name} ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                                        <Play className="w-10 h-10 text-white/70" />
                                                    </div>
                                                )}
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                            </Carousel>
                        </div>
                    ) : (
                        firstMedia!.type === 'image' ? (
                            <img
                                src={firstMedia!.url}
                                alt={project.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                <Play className="w-10 h-10 text-white/70" />
                            </div>
                        )
                    )}
                </div>
            ) : (
                /* Original Icon Header */
                <div className="px-4 pt-6 pb-2">
                    <div className="flex items-center gap-2">

                        <h3 className="text-lg font-semibold group-hover:text-primary transition-smooth break-words">
                            {project.name}
                        </h3>
                    </div>
                </div>
            )}

            <div className="p-4 flex-1 flex flex-col">
                {hasMedia && (
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-smooth">
                        {project.name}
                    </h3>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {project.shortDescription || t(`projects.items.${project.id}.description`)}
                </p>

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

                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-subtle">
                    {project.links.github && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.links.github, '_blank', 'noopener,noreferrer');
                            }}
                            className="flex-1 min-w-0 text-xs"
                        >
                            <Github className="w-3 h-3 mr-1.5" />
                            {t('common.code')}
                        </Button>
                    )}
                    {(project.links.demo || project.links.docs) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.links.docs || project.links.demo, '_blank', 'noopener,noreferrer');
                            }}
                            className="flex-1 min-w-0 text-xs"
                        >
                            <ExternalLink className="w-3 h-3 mr-1.5" />
                            {project.links.docs ? t('common.docs') : t('common.demo')}
                        </Button>
                    )}
                    {project.buttons?.map((btn, i) => {
                        const iconMap = {
                            github: Github,
                            docs: FileText,
                            download: Download,
                            play: Play,
                            youtube: Youtube,
                            figma: Figma,
                            book: Book,
                            monitor: Monitor,
                            external: ExternalLink
                        };
                        const Icon = btn.icon && iconMap[btn.icon as keyof typeof iconMap] ? iconMap[btn.icon as keyof typeof iconMap] : ExternalLink;
                        return (
                            <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(btn.url, '_blank', 'noopener,noreferrer');
                                }}
                                className="flex-1 min-w-0 text-xs"
                            >
                                <Icon className="w-3 h-3 mr-1.5" />
                                {t(btn.labelKey)}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export const ProjectsDialog = () => {
    const { t } = useTranslation();
    const { projects } = useProjects();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">
                    {t('projects.view_all', 'View All Projects')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl h-[90vh] p-0 bg-background/95 backdrop-blur-xl border-subtle">
                <DialogHeader className="px-6 py-4 border-b border-subtle">
                    <DialogTitle className="text-2xl font-bold">{t('projects.title')}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[calc(90vh-80px)] px-6 py-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
