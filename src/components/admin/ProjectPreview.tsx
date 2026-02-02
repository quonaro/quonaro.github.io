import { useState, useEffect, useRef } from 'react';
import { Project, ProjectMedia } from '@/types/project';
import { GalleryCard } from '@/components/GalleryCard';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProjectPreviewProps {
    formValues: Project;
    activeSlideIndex: number;
    previewApi: any;
    setPreviewApi: (api: any) => void;
    previewLang: 'en' | 'ru';
    setPreviewLang: (lang: 'en' | 'ru') => void;
    onUpdateMedia: (index: number, updates: Partial<ProjectMedia>) => void;
}

export const ProjectPreview = ({
    formValues,
    activeSlideIndex,
    previewApi,
    setPreviewApi,
    previewLang,
    setPreviewLang,
    onUpdateMedia
}: ProjectPreviewProps) => {
    const { t } = useTranslation();
    const media = formValues.media?.[activeSlideIndex];

    // Local state for performant transformations
    const [localTransform, setLocalTransform] = useState<{ scale: number; x: number; y: number } | null>(null);

    // Sync local state when slide changes
    useEffect(() => {
        if (media) {
            setLocalTransform({
                scale: media.scale || 1,
                x: media.translate?.x || 0,
                y: media.translate?.y || 0
            });
        }
    }, [activeSlideIndex, media?.url]); // Reset when slide or image changes

    const handleSliderChange = (key: 'scale' | 'x' | 'y', value: number) => {
        setLocalTransform(prev => prev ? ({ ...prev, [key]: value }) : { scale: 1, x: 0, y: 0, [key]: value });
    };

    const handleSliderCommit = () => {
        if (localTransform && media) {
            const currentMedia = formValues.media[activeSlideIndex];
            // Only update if changed to avoid unnecessary parent re-renders
            if (
                currentMedia.scale !== localTransform.scale ||
                currentMedia.translate?.x !== localTransform.x ||
                currentMedia.translate?.y !== localTransform.y
            ) {
                onUpdateMedia(activeSlideIndex, {
                    scale: localTransform.scale,
                    translate: { x: localTransform.x, y: localTransform.y }
                });
            }
        }
    };

    // Calculate frame styles (simplified version or passing logic?)
    // For now, we'll keep the visual frame simple or rely on the passed props if needed.
    // To properly support the "Photoshop-style" resizing borders, we'd need imageDimensions logic here too.
    // For now, we will render the transform applied to a wrapper or the card?
    // The original code applied transform to a wrapper AROUND GalleryCard but GalleryCard was pointer-events-none.

    // Actually, looking at previous code, the frame handles were complex. 
    // Since we are switching to Sliders ONLY, we don't need the drag handles on the image!
    // The user said "Instead of moving with mouse... do sliders". 
    // So we can REMOVE the complex handle logic and just apply transform to the view.

    const transformStyle = localTransform ? {
        transform: `translate(${localTransform.x}px, ${localTransform.y}px) scale(${localTransform.scale})`,
        transformOrigin: 'center'
    } : {};

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Lang Toggle */}
            <div className="flex-none bg-surface/30 p-1 rounded-full border border-subtle flex relative">
                <button
                    type="button"
                    onClick={() => setPreviewLang('en')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all duration-300",
                        previewLang === 'en' ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    English
                </button>
                <button
                    type="button"
                    onClick={() => setPreviewLang('ru')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all duration-300",
                        previewLang === 'ru' ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Русский
                </button>
            </div>

            {/* Preview Window */}
            <div className="flex-1 min-h-[400px] w-full relative overflow-hidden transition-all duration-500 rounded-2xl shadow-2xl border border-subtle bg-neutral-950 flex items-center justify-center">
                <div className="w-full h-full relative group/preview overflow-hidden">
                    {/* Applied Transform Wrapper */}
                    <div
                        className="w-full h-full transition-transform duration-75 ease-out"
                    >
                        <GalleryCard
                            key={previewLang}
                            project={formValues}
                            forcedLanguage={previewLang}
                            forceHover={true}
                            hideEditButton={true}
                            setCarouselApi={setPreviewApi}
                            disableGestures={true}
                            className="min-h-[0px] h-full w-full pointer-events-none"
                        />
                    </div>
                </div>
            </div>

            {/* Controls - Full Width below preview */}
            <div className="flex-none w-full bg-surface/30 backdrop-blur-sm border border-subtle p-6 rounded-2xl space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preview Controls</span>
                    {media?.type === 'image' && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                            Selecting: {String(activeSlideIndex + 1).padStart(2, '0')}
                        </span>
                    )}
                </div>

                {media?.type === 'image' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Scale */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                <span>Scale</span>
                                <span className="text-primary">{Math.round((localTransform?.scale || 1) * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="5"
                                step="0.01"
                                value={localTransform?.scale || 1}
                                onChange={(e) => handleSliderChange('scale', parseFloat(e.target.value))}
                                onMouseUp={handleSliderCommit}
                                onTouchEnd={handleSliderCommit}
                                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                            />
                        </div>

                        {/* X Offset */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                <span>X Offset</span>
                                <span className="text-primary">{Math.round(localTransform?.x || 0)}px</span>
                            </div>
                            <input
                                type="range"
                                min="-500"
                                max="500"
                                step="1"
                                value={localTransform?.x || 0}
                                onChange={(e) => handleSliderChange('x', parseFloat(e.target.value))}
                                onMouseUp={handleSliderCommit}
                                onTouchEnd={handleSliderCommit}
                                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                            />
                        </div>

                        {/* Y Offset */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                                <span>Y Offset</span>
                                <span className="text-primary">{Math.round(localTransform?.y || 0)}px</span>
                            </div>
                            <input
                                type="range"
                                min="-500"
                                max="500"
                                step="1"
                                value={localTransform?.y || 0}
                                onChange={(e) => handleSliderChange('y', parseFloat(e.target.value))}
                                onMouseUp={handleSliderCommit}
                                onTouchEnd={handleSliderCommit}
                                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-4 text-sm text-muted-foreground border border-dashed border-subtle rounded-xl">
                        Select an image slide to enable transform controls
                    </div>
                )}
            </div>
        </div>
    );
};
