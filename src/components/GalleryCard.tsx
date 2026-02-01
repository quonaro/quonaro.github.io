import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Fade from 'embla-carousel-fade';
import Autoplay from 'embla-carousel-autoplay';
import { ExternalLink, Github, FileText, Download, Play, Youtube, Figma, Book, Monitor } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { Project } from '@/types/project';

interface GalleryCardProps {
    project: Project;
    forcedLanguage?: 'en' | 'ru';
}

export const GalleryCard = ({ project, forcedLanguage }: GalleryCardProps) => {
    const { t, i18n } = useTranslation();
    const [api, setApi] = useState<CarouselApi>();

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

    return (
        <div
            className={`
              relative rounded-2xl overflow-hidden cursor-pointer group/card border-none outline-none ring-0
              transition-[flex-grow] duration-500 ease-out will-change-[flex-grow]
              flex-1 sm:hover:flex-[2.5]
              group-hover:opacity-50 sm:hover:!opacity-100
              group-hover:grayscale sm:hover:!grayscale-0
              bg-muted/20 min-h-[400px] sm:min-h-[300px] w-full
            `}
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                {project.media && project.media.length > 1 ? (
                    <Carousel
                        setApi={setApi}
                        className="w-full h-full"
                        opts={{ loop: true }}
                        plugins={[
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
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious
                            className="left-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-500 group-hover/card:delay-0 z-40"
                        />
                        <CarouselNext
                            className="right-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-500 group-hover/card:delay-0 z-40"
                        />
                    </Carousel>
                ) : project.media && project.media.length > 0 ? (
                    <img
                        src={project.media[0].url}
                        alt={getLocal(project.name)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-700">
                        {t('admin.dashboard.noMedia')}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Content Content */}
            <div className="absolute inset-0 p-6 pb-10 flex flex-col justify-end pointer-events-none">
                <div className="transition-all duration-300 transform translate-y-0 sm:translate-y-2 sm:group-hover/card:translate-y-0 opacity-100 sm:opacity-90 sm:group-hover/card:opacity-100 pointer-events-auto w-full">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 truncate">
                        {getLocal(project.name, 'Project Name')}
                    </h3>

                    {/* Expanded Content */}
                    <div className="overflow-hidden transition-all duration-500 delay-75 max-h-60 opacity-100 sm:max-h-0 sm:opacity-0 sm:group-hover/card:max-h-60 sm:group-hover/card:opacity-100 mt-2">
                        <p className="text-gray-300 text-[12px] sm:text-sm mb-4 line-clamp-2">
                            {getLocal(project.shortDescription)}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {project.technologies && project.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="text-[10px] px-2 py-0.5 bg-black/40 backdrop-blur-md text-white/90 rounded-md font-mono border border-white/20"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {project.buttons && project.buttons.map((btn, i) => {
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
                                        className="h-8 text-[10px] font-bold uppercase tracking-wider bg-primary/30 hover:bg-primary/50 text-white border border-primary/40"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(btn.url, '_blank', 'noopener,noreferrer');
                                        }}
                                    >
                                        <Icon className="w-3 h-3 mr-1" />
                                        {getLabel(btn)}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
