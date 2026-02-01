import { Github, ExternalLink, Play, FileText, Download, Youtube, Figma, Book, Monitor, Plus, Pencil, Trash2, Star } from "lucide-react";
import Fade from 'embla-carousel-fade';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useProjects } from "@/hooks/useProjects";
import { Project } from "@/types/project";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ProjectForm } from "./admin/ProjectForm";
import { createProject, updateProject, deleteProject } from "@/services/projects";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ProjectCard = ({ project, galleryCount, refetch }: { project: Project; galleryCount: number; refetch: () => void }) => {
    const { t, i18n } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const lang = i18n.language as 'en' | 'ru';

    const getLocalized = (field: any) => {
        if (!field) return '';
        let obj = field;
        if (typeof field === 'string' && field.trim().startsWith('{')) {
            try { obj = JSON.parse(field); } catch (e) { return field; }
        }
        if (typeof obj === 'object' && obj !== null) {
            const currentLang = (i18n.language || 'en').split('-')[0];
            return obj[currentLang] || obj['en'] || obj['ru'] || '';
        }
        return field;
    };

    const hasMedia = project.media && project.media.length > 0;
    const firstMedia = hasMedia ? project.media![0] : null;

    const primaryUrl = project.buttons && project.buttons.length > 0
        ? project.buttons[0].url
        : (project.links?.demo || project.links?.github || '#');

    const getBtnLabel = (btn: any) => {
        if (!btn) return 'Link';
        let label = btn.label;
        if (typeof label === 'string' && label.trim().startsWith('{')) {
            try { label = JSON.parse(label); } catch (e) { }
        }
        if (label && typeof label === 'object') {
            const currentLang = (i18n.language || 'en').split('-')[0];
            return label[currentLang] || label['en'] || label['ru'] || 'Link';
        }
        if (btn.labelKey) return t(btn.labelKey);
        return typeof label === 'string' ? label : 'Link';
    };

    const handleUpdate = async (data: Project) => {
        try {
            const { id, ...updates } = data;
            await updateProject(id, updates);
            toast.success(t('admin.form.successUpdated'));
            setIsEditDialogOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProject(project.id);
            toast.success(t('admin.form.successDeleted'));
            refetch();
        } catch (error: any) {
            toast.error(error.message);
        }
    };


    const handleToggleGallery = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!project.is_in_gallery && galleryCount >= 7) {
            toast.error(t('admin.gallery.limitReached'));
            return;
        }

        try {
            await updateProject(project.id, { is_in_gallery: !project.is_in_gallery });
            toast.success(!project.is_in_gallery ? t('admin.gallery.added') : t('admin.gallery.removed'));
            refetch();
        } catch (error: any) {
            toast.error(error.message);
        }
    };
    return (
        <div
            onClick={() => window.open(primaryUrl, '_blank', 'noopener,noreferrer')}
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
                                                        alt={`${getLocalized(project.name)} ${index + 1}`}
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
                                alt={getLocalized(project.name)}
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
                            {getLocalized(project.name)}
                        </h3>
                    </div>
                </div>
            )}

            <div className="p-4 flex-1 flex flex-col">
                {hasMedia && (
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-smooth">
                        {getLocalized(project.name)}
                    </h3>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {getLocalized(project.shortDescription) || t(`projects.items.${project.id}.description`)}
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
                    {/* Render legacy links if present and buttons are empty */}
                    {(!project.buttons || project.buttons.length === 0) && project.links && (
                        <>
                            {project.links.github && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(project.links!.github, '_blank', 'noopener,noreferrer');
                                    }}
                                    className="flex-1 min-w-0 text-[10px] font-bold uppercase tracking-wider bg-primary/30 hover:bg-primary/50 text-white border border-primary/40"
                                >
                                    <Github className="w-3 h-3 mr-1.5" />
                                    {t('common.code')}
                                </Button>
                            )}
                            {(project.links.demo || project.links.docs) && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(project.links!.docs || project.links!.demo, '_blank', 'noopener,noreferrer');
                                    }}
                                    className="flex-1 min-w-0 text-[10px] font-bold uppercase tracking-wider bg-primary/30 hover:bg-primary/50 text-white border border-primary/40"
                                >
                                    <ExternalLink className="w-3 h-3 mr-1.5" />
                                    {project.links.docs ? t('common.docs') : t('common.demo')}
                                </Button>
                            )}
                        </>
                    )}

                    {/* Render dynamic buttons */}
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
                                variant="default"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(btn.url, '_blank', 'noopener,noreferrer');
                                }}
                                className="flex-1 min-w-0 text-[10px] font-bold uppercase tracking-wider bg-primary/20 hover:bg-primary/40 text-primary-foreground border border-primary/30"
                            >
                                <Icon className="w-3 h-3 mr-1.5" />
                                {getBtnLabel(btn)}
                            </Button>
                        );
                    })}
                </div>

                {/* Admin Edit Button */}
                {isAuthenticated && (
                    <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary transition-all shadow-xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] bg-background/95 backdrop-blur-2xl border-subtle overflow-hidden flex flex-col p-0" onClick={(e) => e.stopPropagation()}>
                                <DialogHeader className="px-8 py-6 border-b border-subtle flex-shrink-0">
                                    <DialogTitle className="text-3xl font-black tracking-tight">{t('admin.form.editTitle')}</DialogTitle>
                                </DialogHeader>
                                <div className="flex-1 overflow-hidden p-8">
                                    <ProjectForm
                                        initialData={project}
                                        onSubmit={handleUpdate}
                                        onCancel={() => setIsEditDialogOpen(false)}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="h-8 w-8 rounded-full bg-destructive/80 backdrop-blur-md border border-destructive/20 text-white hover:bg-destructive hover:border-destructive transition-all shadow-xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-subtle" onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('admin.dashboard.confirmDeleteTitle')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('admin.dashboard.confirmDeleteDesc')}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-full">{t('admin.dashboard.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">{t('admin.dashboard.delete')}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}

                {/* Gallery Toggle Button */}
                {isAuthenticated && (
                    <button
                        onClick={handleToggleGallery}
                        className={cn(
                            "absolute top-2 left-2 z-50 p-2 rounded-full backdrop-blur-md border transition-all duration-300 shadow-xl",
                            project.is_in_gallery
                                ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-500 opacity-100"
                                : "bg-white/10 border-white/20 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-yellow-500 hover:bg-yellow-500/10"
                        )}
                        title={project.is_in_gallery ? "Remove from Gallery" : "Add to Gallery"}
                    >
                        <Star className={cn("w-4 h-4", project.is_in_gallery && "fill-yellow-500")} />
                    </button>
                )}
            </div>
        </div>
    );
};

export const ProjectsDialog = () => {
    const { t } = useTranslation();
    const { projects, refetch } = useProjects();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleCreate = async (data: Project) => {
        try {
            await createProject(data);
            toast.success(t('admin.form.successCreated'));
            setIsFormOpen(false);
            refetch();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const galleryCount = projects.filter(p => p.is_in_gallery).length;

    return (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className="min-w-[160px] h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 border-none"
                    >
                        {t('projects.view_all', 'View All Projects')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl h-[90vh] p-0 bg-background/95 backdrop-blur-xl border-subtle">
                    <DialogHeader className="px-6 py-4 border-b border-subtle flex flex-row items-center justify-start gap-4">
                        {isAuthenticated && (
                            <div className="text-sm font-mono px-3 py-1 bg-muted/50 rounded-md border border-subtle">
                                <span className={galleryCount >= 7 ? "text-red-500 font-bold" : "text-primary"}>
                                    {t('admin.gallery.counter', { count: galleryCount })}
                                </span>
                            </div>
                        )}
                        <DialogTitle className="text-2xl font-bold">{t('projects.title')}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[calc(90vh-80px)] px-6 py-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} galleryCount={galleryCount} refetch={refetch} />
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {isAuthenticated && (
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="min-w-[160px] h-11 bg-green-600 hover:bg-green-700 text-white border-none shadow-lg shadow-green-900/20"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('admin.dashboard.newProject', 'New Project')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] bg-background/95 backdrop-blur-2xl border-subtle overflow-hidden flex flex-col p-0">
                        <DialogHeader className="px-8 py-6 border-b border-subtle flex-shrink-0">
                            <DialogTitle className="text-3xl font-black tracking-tight">{t('admin.form.newTitle')}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-hidden p-8">
                            <ProjectForm
                                onSubmit={handleCreate}
                                onCancel={() => setIsFormOpen(false)}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};
