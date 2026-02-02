import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useProjects } from '@/hooks/useProjects';
import Autoplay from 'embla-carousel-autoplay';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { ProjectsDialog } from './ProjectsDialog';
import { GalleryCard } from './GalleryCard';
import { cn } from '@/lib/utils';

const PlaceholderCard = () => (
    <div className="flex-1 min-h-[400px] sm:min-h-[300px] rounded-2xl bg-muted/5 border-2 border-dashed border-subtle/20 flex flex-col items-center justify-center p-6 transition-all duration-500">
        <div className="w-12 h-12 rounded-full bg-muted/10 mb-4 animate-pulse" />
        <div className="w-24 h-4 bg-muted/10 rounded animate-pulse mb-2" />
        <div className="w-32 h-3 bg-muted/5 rounded animate-pulse" />
    </div>
);

const ProjectGallery = () => {
    const { t } = useTranslation();
    const { projects } = useProjects();
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    // Show gallery projects (max 7)
    const galleryProjects = useMemo(() => {
        return projects.filter(p => p.is_in_gallery);
    }, [projects]);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    if (projects.length === 0) return null;

    return (
        <section id="projects" className="w-full py-12 sm:py-16 md:py-20 overflow-hidden" style={{ background: 'linear-gradient(to bottom, hsl(220 27% 8%), hsl(220 27% 7%))' }}>
            <div className="container mx-auto px-4 mb-10 sm:mb-12 md:mb-16 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
                    {t('projects.title')}
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
                    {t('projects.subtitle')}
                </p>
            </div>

            {/* Mobile Carousel View */}
            <div className="block sm:hidden w-full">
                <Carousel
                    setApi={setApi}
                    opts={{
                        loop: true,
                        align: "start",
                    }}
                    plugins={[
                        Autoplay({
                            delay: 5000,
                            stopOnInteraction: false,
                        })
                    ]}
                    className="w-full"
                >
                    <CarouselContent className="-ml-0">
                        {galleryProjects.length > 0 ? (
                            galleryProjects.map((project) => (
                                <CarouselItem key={project.id} className="pl-0 basis-full">
                                    <div className="px-4">
                                        <GalleryCard project={project} />
                                    </div>
                                </CarouselItem>
                            ))
                        ) : (
                            Array.from({ length: 7 }).map((_, i) => (
                                <CarouselItem key={i} className="pl-0 basis-full">
                                    <div className="px-4">
                                        <PlaceholderCard />
                                    </div>
                                </CarouselItem>
                            ))
                        )}
                    </CarouselContent>
                </Carousel>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: count }).map((_, i) => (
                        <button
                            key={i}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                current === i
                                    ? "bg-primary w-6"
                                    : "bg-muted-foreground/30"
                            )}
                            onClick={() => api?.scrollTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>


            {/* Desktop Accordion View */}
            <div className="hidden sm:flex h-[400px] sm:h-[500px] w-full max-w-[calc(100%_-_120px)] mx-auto px-4 gap-2 group">
                {galleryProjects.length > 0 ? (
                    galleryProjects.map((project) => (
                        <GalleryCard key={project.id} project={project} />
                    ))
                ) : (
                    Array.from({ length: 7 }).map((_, i) => (
                        <PlaceholderCard key={i} />
                    ))
                )}
            </div>


            <div className="container mx-auto px-4 mt-8 sm:mt-12 text-center">
                <ProjectsDialog />
            </div>
        </section>
    );
};

export default ProjectGallery;
