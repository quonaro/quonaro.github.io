import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Fade from 'embla-carousel-fade';
import Autoplay from 'embla-carousel-autoplay';
import { ExternalLink, Github, FileText, Download, Play, Youtube, Figma, Book, Monitor, Pencil, Trash2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProjectForm } from './admin/ProjectForm';
import { updateProject, deleteProject } from '@/services/projects';
import { toast } from 'sonner';

interface GalleryCardProps {
    project: Project;
    forcedLanguage?: 'en' | 'ru';
    hideEditButton?: boolean;
    forceHover?: boolean;
    className?: string;
    setCarouselApi?: (api: CarouselApi) => void;
    disableGestures?: boolean;
}

export const GalleryCard = ({ project, forcedLanguage, hideEditButton = false, forceHover = false, className, setCarouselApi, disableGestures = false }: GalleryCardProps) => {
    const { t, i18n } = useTranslation();
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const [api, setApi] = useState<CarouselApi>();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const lang = forcedLanguage || (i18n.language as 'en' | 'ru');

    // Generate a random delay between 5000ms and 8000ms to desynchronize carousels
    const autoplayDelay = useMemo(() => Math.floor(Math.random() * 3000) + 5000, []);

    // Helper to get localized text safely
    const getLocal = (field: any, fallback: string = '') => {
        if (!field) return fallback;

        let obj = field;
        // Handle potential stringified JSON from DB
        if (typeof field === 'string' && field.trim().startsWith('{')) {
            try {
                obj = JSON.parse(field);
            } catch (e) {
                return field;
            }
        }

        if (typeof obj === 'object' && obj !== null) {
            const currentLang = (forcedLanguage || i18n.language || 'en').split('-')[0];
            return obj[currentLang] || obj['en'] || obj['ru'] || fallback;
        }
        return field;
    };

    const getLabel = (btn: any) => {
        if (!btn) return 'Link';

        let label = btn.label;
        if (typeof label === 'string' && label.trim().startsWith('{')) {
            try { label = JSON.parse(label); } catch (e) { }
        }

        if (label && typeof label === 'object') {
            const currentLang = (forcedLanguage || i18n.language || 'en').split('-')[0];
            return label[currentLang] || label['en'] || label['ru'] || 'Link';
        }
        if (btn.labelKey) {
            return t(btn.labelKey);
        }
        return typeof label === 'string' ? label : 'Link';
    };
    const handleUpdate = async (data: Project) => {
        try {
            const { id, ...updates } = data;
            await updateProject(id, updates);
            toast.success(t('admin.form.successUpdated'));
            setIsEditDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProject(project.id);
            toast.success(t('admin.form.successDeleted'));
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const isHovered = forceHover;

    return (
        <div
            className={cn(`
              relative rounded-2xl overflow-hidden cursor-pointer group/card border-none outline-none ring-0
              transition-[flex-grow] duration-500 ease-out will-change-[flex-grow]
              flex-1 sm:hover:flex-[2.5]
              group-hover:opacity-50 sm:hover:!opacity-100
              group-hover:grayscale sm:hover:!grayscale-0
              bg-muted/20 min-h-[400px] sm:min-h-[300px] w-full
            `,
                isHovered && "opacity-100 grayscale-0 sm:flex-[2.5]",
                className)}
        >
            {/* Background Image / Media */}
            <div className="absolute inset-0">
                <div className={cn(
                    "absolute inset-0 transition-opacity duration-700 opacity-100 group-hover/card:opacity-0",
                    isHovered && "opacity-0"
                )}>
                    {project.cover_image ? (
                        <img
                            src={project.cover_image}
                            alt={getLocal(project.name)}
                            className="w-full h-full object-cover"
                        />
                    ) : project.media && project.media.length > 0 ? (
                        <img
                            src={project.media[0].url}
                            alt={getLocal(project.name)}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-700">
                            {t('admin.dashboard.noMedia')}
                        </div>
                    )}
                </div>

                <div className={cn(
                    "absolute inset-0 transition-opacity duration-700 opacity-0 group-hover/card:opacity-100",
                    isHovered && "opacity-100"
                )}>
                    {project.media && project.media.length > 1 ? (
                        <Carousel
                            setApi={(api) => {
                                setApi(api);
                                if (setCarouselApi) setCarouselApi(api);
                            }}
                            className="w-full h-full"
                            opts={{
                                loop: true,
                                watchDrag: !disableGestures
                            }}
                            plugins={disableGestures ? [] : [
                                Fade(),
                                Autoplay({
                                    delay: autoplayDelay,
                                    stopOnInteraction: false,
                                    stopOnMouseEnter: true
                                })
                            ]}
                        >
                            <CarouselContent className="h-full ml-0">
                                {project.media.map((media, index) => (
                                    <CarouselItem key={index} className="h-full pl-0">
                                        <img
                                            src={media.url}
                                            alt={`${getLocal(project.name)} ${index + 1}`}
                                            className={cn(
                                                "w-full h-full transition-transform duration-700",
                                                (media.scale || media.translate) ? "object-contain" : (media.objectFit === 'contain' ? "object-contain" : "object-cover")
                                            )}
                                            style={{
                                                transform: `
                                                    translate(${media.translate?.x || 0}px, ${media.translate?.y || 0}px)
                                                    scale(${media.scale || 1})
                                                `,
                                                transformOrigin: 'center'
                                            }}
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious
                                className={cn("left-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-40")}
                            />
                            <CarouselNext
                                className={cn("right-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-40")}
                            />
                        </Carousel>
                    ) : project.media && project.media.length > 0 ? (
                        <img
                            src={project.media[0].url}
                            alt={getLocal(project.name)}
                            className={cn(
                                "w-full h-full transition-transform duration-700",
                                (project.media[0].scale || project.media[0].translate) ? "object-contain" : (project.media[0].objectFit === 'contain' ? "object-contain" : "object-cover")
                            )}
                            style={{
                                transform: `
                                    translate(${project.media[0].translate?.x || 0}px, ${project.media[0].translate?.y || 0}px)
                                    scale(${project.media[0].scale || 1})
                                `,
                                transformOrigin: 'center'
                            }}
                        />
                    ) : !project.cover_image ? (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-700">
                            {t('admin.dashboard.noMedia')}
                        </div>
                    ) : null}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Admin Edit Button */}
            {isAuthenticated && !hideEditButton && (
                <div className="absolute top-4 right-4 z-50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:border-primary transition-all shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Pencil className="w-4 h-4" />
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
                                className="h-10 w-10 rounded-full bg-destructive/80 backdrop-blur-md border border-destructive/20 text-white hover:bg-destructive hover:border-destructive transition-all shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Trash2 className="w-4 h-4" />
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

            {/* Static Content (Visible when not hovered) */}
            <div className={cn(
                "absolute inset-x-0 bottom-0 p-6 transition-opacity duration-300 pointer-events-none z-10",
                "opacity-100 group-hover/card:opacity-0",
                isHovered && "opacity-0"
            )}>
                <h3 className="text-xl font-bold text-white mb-2 truncate drop-shadow-lg">
                    {getLocal(project.name, 'Project Name')}
                </h3>
            </div>

            {/* Hover Footer (Visible only on hover/expand) */}
            <div className={cn(
                "absolute inset-x-0 bottom-0 bg-neutral-900/40 backdrop-blur-2xl border-t border-white/10 p-6 flex flex-col gap-4 z-40",
                "transform transition-all duration-500 ease-out",
                "translate-y-full opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100",
                isHovered && "translate-y-0 opacity-100",
                "pointer-events-auto"
            )}>
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none">
                        {getLocal(project.name)}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {getLocal(project.shortDescription)}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech) => {
                        const colors = [
                            'bg-blue-500/20 text-blue-400 border-blue-500/30',
                            'bg-purple-500/20 text-purple-400 border-purple-500/30',
                            'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                            'bg-orange-500/20 text-orange-400 border-orange-500/30',
                            'bg-pink-500/20 text-pink-400 border-pink-500/30',
                            'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
                            'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                        ];
                        const charCodeSum = tech.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        const colorClass = colors[charCodeSum % colors.length];

                        return (
                            <span
                                key={tech}
                                className={cn(
                                    "text-[10px] px-2 py-0.5 rounded font-mono border backdrop-blur-md transition-colors",
                                    colorClass
                                )}
                            >
                                {tech}
                            </span>
                        );
                    })}
                </div>

                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
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
                                className="h-9 px-4 flex-1 sm:flex-none text-[10px] font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(btn.url, '_blank', 'noopener,noreferrer');
                                }}
                            >
                                <Icon className="w-3.5 h-3.5 mr-2" />
                                {getLabel(btn)}
                            </Button>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};
