import { useState, useEffect } from 'react';
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

const ProjectGallery = () => {
    const { t } = useTranslation();
    const { projects } = useProjects();
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    // Show top 5 projects
    const galleryProjects = projects.slice(0, 5);

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
        <section className="w-full bg-background py-12 sm:py-16 md:py-20 overflow-hidden">
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
                        {galleryProjects.map((project) => (
                            <CarouselItem key={project.id} className="pl-0 basis-full">
                                <div className="px-4">
                                    <GalleryCard project={project} />
                                </div>
                            </CarouselItem>
                        ))}
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
            <div className="hidden sm:flex h-[400px] sm:h-[500px] w-full max-w-[1600px] mx-auto px-4 gap-2 group">
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
