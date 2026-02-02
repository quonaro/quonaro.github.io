import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { ProjectMedia } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectLightboxProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    media: ProjectMedia[];
    initialIndex?: number;
}

export const ProjectLightbox = ({
    open,
    onOpenChange,
    media,
    initialIndex = 0,
}: ProjectLightboxProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Sync initial index only when opening
    useEffect(() => {
        if (open && api) {
            api.scrollTo(initialIndex, true);
            setCurrentIndex(initialIndex);
        }
    }, [open, api]); // Removed initialIndex from deps to avoid syncing with background carousel updates

    useEffect(() => {
        if (!api) return;

        const onSelect = () => {
            setCurrentIndex(api.selectedScrollSnap());
        };

        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);

    const handlePrevious = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        api?.scrollPrev();
    }, [api]);

    const handleNext = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        api?.scrollNext();
    }, [api]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") api?.scrollPrev();
        if (e.key === "ArrowRight") api?.scrollNext();
    }, [api]);

    useEffect(() => {
        if (open) {
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, [open, handleKeyDown]);

    if (!media || media.length === 0) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                hideClose
                className="max-w-[100vw] w-screen h-screen p-0 bg-black/95 border-none shadow-none z-[60] flex flex-col items-center justify-center outline-none"
                aria-describedby={undefined}
            >
                <DialogTitle className="sr-only">Project Media Gallery</DialogTitle>
                <DialogDescription className="sr-only">Full screen view of project images and videos</DialogDescription>

                {/* Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-50 text-white/70 hover:text-white hover:bg-white/10 rounded-full w-12 h-12"
                    onClick={() => onOpenChange(false)}
                >
                    <X className="w-6 h-6" />
                </Button>

                {/* Navigation Buttons (only if multiple items) */}
                {media.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white hover:bg-white/10 rounded-full w-12 h-12 hidden sm:flex"
                            onClick={handlePrevious}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white hover:bg-white/10 rounded-full w-12 h-12 hidden sm:flex"
                            onClick={handleNext}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </Button>
                    </>
                )}

                {/* Main Carousel */}
                <Carousel
                    setApi={setApi}
                    className="w-full h-full flex items-center justify-center"
                    opts={{
                        loop: true,
                    }}
                >
                    <CarouselContent className="h-full ml-0">
                        {media.map((item, index) => (
                            <CarouselItem key={index} className="h-full pl-0 flex items-center justify-center relative select-none">
                                {item.type === 'video' ? (
                                    <video
                                        src={item.url}
                                        controls
                                        className="max-w-[80vw] max-h-[80vh] w-auto h-auto object-contain outline-none rounded-md shadow-2xl"
                                        poster={item.thumbnail}
                                    />
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={`Project media ${index + 1}`}
                                        className="max-w-[80vw] max-h-[80vh] w-auto h-auto object-contain pointer-events-none select-none rounded-md shadow-2xl"
                                    />
                                )}
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Counter / Dots */}
                {media.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                        {media.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300",
                                    i === currentIndex ? "bg-white w-4" : "bg-white/30"
                                )}
                            />
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
