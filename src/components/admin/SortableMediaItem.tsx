import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectMedia } from '@/types/project';

interface SortableMediaItemProps {
    id: string;
    media: ProjectMedia & { id: string }; // React Hook Form field has id
    index: number;
    isActive: boolean;
    onRemove: () => void;
    onPreview: () => void;
}

export const SortableMediaItem = ({
    id,
    media,
    index,
    isActive,
    onRemove,
    onPreview
}: SortableMediaItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative group aspect-video bg-muted/40 rounded-xl overflow-hidden border transition-all shadow-inner touch-none",
                isActive ? "border-primary ring-2 ring-primary/20 scale-95" : "border-subtle",
                isDragging ? "opacity-50 ring-2 ring-primary scale-105 z-50" : ""
            )}
        >
            <div
                className="absolute inset-0 z-0"
                onClick={onPreview}
            >
                {media.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-black/10">
                        <span className="text-xs font-mono text-muted-foreground">VIDEO</span>
                    </div>
                ) : (
                    <img
                        src={media.url}
                        alt="preview"
                        className="w-full h-full object-cover pointer-events-none"
                    />
                )}
            </div>

            {/* Controls Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 z-10 pointer-events-none">
                <div className="flex gap-2 pointer-events-auto">
                    {/* Drag Handle */}
                    <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full cursor-grab active:cursor-grabbing"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical className="w-4 h-4" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Index Badge */}
            <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-white/50 pointer-events-none">
                {index + 1}
            </div>
        </div>
    );
};
