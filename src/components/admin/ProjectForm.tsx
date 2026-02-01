
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Upload, Loader2, Plus, Tags, Image as ImageIcon, Layout, Type, Save } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { compressImage } from '@/utils/media-compression';
import { uploadProjectMedia } from '@/services/projects';
import { toast } from 'sonner';
import { GalleryCard } from '@/components/GalleryCard';

import { cn } from '@/lib/utils';

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (data: Project) => Promise<void>;
    onCancel: () => void;
}

const AVAILABLE_ICONS = ['github', 'external', 'docs', 'download', 'play', 'youtube', 'figma', 'book', 'monitor'];

const GRADIENT_PRESETS = [
    'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500',
    'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-700',
    'bg-gradient-to-br from-orange-500 via-red-600 to-rose-700',
    'bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-700',
    'bg-gradient-to-br from-zinc-900 via-slate-800 to-zinc-900',
    'bg-gradient-to-tr from-violet-600 via-indigo-700 to-blue-800',
    'bg-gradient-to-br from-amber-500 via-orange-600 to-yellow-500',
    'bg-gradient-to-tr from-fuchsia-600 via-pink-600 to-rose-500',
    'bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800',
    'bg-gradient-to-tr from-lime-500 via-emerald-600 to-teal-500',
    'bg-gradient-to-br from-rose-600 via-red-700 to-fuchsia-700',
    'bg-gradient-to-tr from-slate-700 via-zinc-800 to-gray-900',
];

export const ProjectForm = ({ initialData, onSubmit, onCancel }: ProjectFormProps) => {
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);
    const [previewLang, setPreviewLang] = useState<'en' | 'ru'>('en');
    const [previewApi, setPreviewApi] = useState<any>();
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, pos: { x: 0, y: 0 }, scale: 1 });
    const [imageDimensions, setImageDimensions] = useState<{ [key: string]: { width: number, height: number, ratio: number } }>({});

    // Normalization helper
    const normalizeLocalField = (field: any) => {
        if (!field) return { en: '', ru: '' };
        let data = field;
        if (typeof field === 'string' && field.trim().startsWith('{')) {
            try {
                data = JSON.parse(field);
            } catch (e) {
                return { en: field, ru: field };
            }
        }
        if (typeof data === 'string') return { en: data, ru: data };
        if (typeof data === 'object' && data !== null) {
            return {
                en: data.en || '',
                ru: data.ru || ''
            };
        }
        return { en: '', ru: '' };
    };

    const { register, control, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<Project>({
        defaultValues: initialData ? {
            ...initialData,
            name: normalizeLocalField(initialData.name),
            shortDescription: normalizeLocalField(initialData.shortDescription)
        } : {
            id: '',
            name: { en: '', ru: '' },
            shortDescription: { en: '', ru: '' },
            technologies: [],
            media: [],
            buttons: []
        }
    });

    const formValues = watch();
    const coverType = watch('cover_config.type') || (formValues.cover_image ? 'image' : 'generated');

    const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
        control,
        name: "media"
    });

    const { fields: buttonFields, append: appendButton, remove: removeButton } = useFieldArray({
        control,
        name: "buttons"
    });

    // Sync active slide index
    useEffect(() => {
        if (!previewApi) return;
        const onSelect = () => setActiveSlideIndex(previewApi.selectedScrollSnap());
        previewApi.on('select', onSelect);
        return () => { previewApi.off('select', onSelect); };
    }, [previewApi]);

    const handleDragStart = (e: React.MouseEvent) => {
        const media = formValues.media?.[activeSlideIndex];
        if (!media || media.type !== 'image') return;

        setIsDragging(true);
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            pos: media.translate || { x: 0, y: 0 },
            scale: media.scale || 1
        });
    };

    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        const media = formValues.media?.[activeSlideIndex];
        if (!media || media.type !== 'image') return;

        setIsResizing(true);
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            pos: media.translate || { x: 0, y: 0 },
            scale: media.scale || 1
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;

            const newX = dragStart.pos.x + deltaX;
            const newY = dragStart.pos.y + deltaY;

            const updatedMedia = [...(formValues.media || [])];
            if (updatedMedia[activeSlideIndex]) {
                updatedMedia[activeSlideIndex] = {
                    ...updatedMedia[activeSlideIndex],
                    translate: { x: newX, y: newY }
                };
                setValue('media', updatedMedia);
            }
        } else if (isResizing) {
            const deltaY = dragStart.y - e.clientY;
            const deltaX = e.clientX - dragStart.x;
            const delta = (Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX) * 0.01;

            const newScale = Math.max(0.1, Math.min(5, dragStart.scale + delta));

            const updatedMedia = [...(formValues.media || [])];
            if (updatedMedia[activeSlideIndex]) {
                updatedMedia[activeSlideIndex] = {
                    ...updatedMedia[activeSlideIndex],
                    scale: newScale
                };
                setValue('media', updatedMedia);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    const updateScale = (val: number[]) => {
        const updatedMedia = [...(formValues.media || [])];
        if (updatedMedia[activeSlideIndex]) {
            updatedMedia[activeSlideIndex] = {
                ...updatedMedia[activeSlideIndex],
                scale: val[0]
            };
            setValue('media', updatedMedia);
        }
    };

    const handleImageLoad = (url: string, e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        setImageDimensions(prev => ({
            ...prev,
            [url]: {
                width: naturalWidth,
                height: naturalHeight,
                ratio: naturalWidth / naturalHeight
            }
        }));
    };

    const getFrameStyles = () => {
        const media = formValues.media?.[activeSlideIndex];
        if (!media || !imageDimensions[media.url]) return { width: '100%', height: '100%' };

        const dim = imageDimensions[media.url];
        const containerWidth = 800;
        const containerHeight = 500;
        const containerRatio = containerWidth / containerHeight;

        let frameWidth, frameHeight;
        if (dim.ratio > containerRatio) {
            frameWidth = containerWidth;
            frameHeight = containerWidth / dim.ratio;
        } else {
            frameHeight = containerHeight;
            frameWidth = containerHeight * dim.ratio;
        }

        return {
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            left: '50%',
            top: '50%',
            marginLeft: `-${frameWidth / 2}px`,
            marginTop: `-${frameHeight / 2}px`
        };
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean = false) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const compressed = await compressImage(file);
                const url = await uploadProjectMedia(compressed);

                if (isCover) {
                    setValue('cover_image', url);
                    toast.success(t('admin.form.successUpdated'));
                    break;
                } else {
                    appendMedia({ type: 'image', url });
                    toast.success(t('admin.form.successCreated'));
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(t('admin.form.errorUpload'));
        } finally {
            setUploading(false);
        }
    };

    const handleFormSubmit = async (data: Project) => {
        try {
            if (!initialData) {
                const slug = data.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                data.id = `${slug || 'project'}-${Math.random().toString(36).substring(2, 7)}`;
            }
            await onSubmit(data);
        } catch (error) {
            console.error(error);
        }
    };

    const [techInput, setTechInput] = useState(initialData?.technologies.join(', ') || '');
    const handleTechBlur = () => {
        const techs = techInput.split(',').map(t => t.trim()).filter(Boolean);
        setValue('technologies', techs);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col xl:flex-row gap-8 h-full">
            {/* Left Column: Form Inputs */}
            <div className="flex-1 space-y-6 overflow-y-auto max-h-[85vh] pr-4 scrollbar-thin scrollbar-thumb-subtle">

                {/* 1. Configuration & Global Info */}
                <div className="space-y-4 border p-6 rounded-2xl bg-surface/30 backdrop-blur-sm border-subtle">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                        <Layout className="w-5 h-5" />
                        <h3 className="font-bold text-lg">{t('admin.form.basicInfo')}</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-muted-foreground">
                                <Tags className="w-4 h-4" /> {t('admin.form.technologies')}
                            </Label>
                            <Input
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onBlur={handleTechBlur}
                                placeholder="React, Vite, CSS"
                                className="bg-background/50"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Cover & Media Section */}
                <div className="space-y-6 border p-6 rounded-2xl bg-surface/30 backdrop-blur-sm border-subtle">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                        <ImageIcon className="w-5 h-5" />
                        <h3 className="font-bold text-lg">{t('admin.form.media')}</h3>
                    </div>

                    {/* Cover Image Sub-section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-muted-foreground flex items-center gap-2">
                                <Layout className="w-4 h-4" /> {t('admin.form.coverImage')}
                            </Label>
                            <div className="flex bg-muted/20 p-1 rounded-xl border border-subtle">
                                <button
                                    type="button"
                                    onClick={() => setValue('cover_config.type', 'image')}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                        coverType === 'image' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Image
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setValue('cover_config.type', 'generated')}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                        coverType === 'generated' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Dynamic
                                </button>
                            </div>
                        </div>

                        {coverType === 'image' ? (
                            <div className="flex gap-4 items-start animate-in fade-in slide-in-from-left-2 duration-300">
                                {formValues.cover_image ? (
                                    <div className="relative w-48 aspect-video bg-muted/40 rounded-xl overflow-hidden border border-subtle shadow-inner group">
                                        <img src={formValues.cover_image} alt="Cover" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                className="h-8 w-8 rounded-full"
                                                onClick={() => setValue('cover_image', '')}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-48 aspect-video border-2 border-dashed border-subtle rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                        {uploading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary" />}
                                        <span className="text-[10px] mt-2 font-medium text-muted-foreground group-hover:text-primary uppercase tracking-wider text-center px-2">
                                            {t('admin.form.uploadCover')}
                                        </span>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, true)} className="hidden" />
                                    </label>
                                )}
                                <div className="flex-1 space-y-2">
                                    <p className="text-[10px] text-muted-foreground italic">
                                        {t('admin.form.previewDesc')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300 bg-muted/10 p-4 rounded-2xl border border-subtle/50">
                                <div className="grid grid-cols-6 gap-2">
                                    {GRADIENT_PRESETS.map((grad, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setValue('cover_config.gradient', grad)}
                                            className={cn(
                                                "aspect-square rounded-lg border-2 transition-all hover:scale-105 active:scale-95",
                                                grad,
                                                formValues.cover_config?.gradient === grad ? "border-white shadow-[0_0_10px_rgba(255,255,255,0.3)] scale-110" : "border-transparent"
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">{t('admin.form.coverTextEn')}</Label>
                                        <Input
                                            {...register('cover_config.text.en')}
                                            placeholder={t('admin.form.emptyForProjectName')}
                                            className="h-9 bg-background/50 border-subtle rounded-xl text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">{t('admin.form.coverTextRu')}</Label>
                                        <Input
                                            {...register('cover_config.text.ru')}
                                            placeholder={t('admin.form.emptyForProjectName')}
                                            className="h-9 bg-background/50 border-subtle rounded-xl text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-subtle/20 pt-4">
                                    {/* Font Family */}
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">Font Family</Label>
                                        <div className="flex bg-background/50 p-1 rounded-xl border border-subtle">
                                            <button
                                                type="button"
                                                onClick={() => setValue('cover_config.fontFamily', 'Inter')}
                                                className={cn(
                                                    "flex-1 px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                                                    (formValues.cover_config?.fontFamily || 'Inter') === 'Inter' ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Inter
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setValue('cover_config.fontFamily', 'Golos')}
                                                className={cn(
                                                    "flex-1 px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                                                    formValues.cover_config?.fontFamily === 'Golos' ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Golos
                                            </button>
                                        </div>
                                    </div>

                                    {/* Font Size */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center px-1">
                                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Size</Label>
                                            <span className="text-[10px] font-bold text-primary">{formValues.cover_config?.fontSize || 32}px</span>
                                        </div>
                                        <Slider
                                            value={[formValues.cover_config?.fontSize || 32]}
                                            min={16}
                                            max={80}
                                            step={1}
                                            onValueChange={(val) => setValue('cover_config.fontSize', val[0])}
                                            className="py-2"
                                        />
                                    </div>

                                    {/* Font Weight */}
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold ml-1">Weight</Label>
                                        <Select
                                            value={String(formValues.cover_config?.fontWeight || 900)}
                                            onValueChange={(val) => setValue('cover_config.fontWeight', Number(val))}
                                        >
                                            <SelectTrigger className="h-9 bg-background/50 border-subtle rounded-xl text-xs">
                                                <SelectValue placeholder="Weight" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="300">Light (300)</SelectItem>
                                                <SelectItem value="400">Regular (400)</SelectItem>
                                                <SelectItem value="500">Medium (500)</SelectItem>
                                                <SelectItem value="600">Semibold (600)</SelectItem>
                                                <SelectItem value="700">Bold (700)</SelectItem>
                                                <SelectItem value="800">Extrabold (800)</SelectItem>
                                                <SelectItem value="900">Black (900)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-subtle/50 my-6" />

                    {/* Gallery Images Sub-section */}
                    <div className="space-y-3">
                        <Label className="text-muted-foreground flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> {t('admin.form.media')} (Gallery)
                        </Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {mediaFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    onClick={() => previewApi?.scrollTo(index)}
                                    className={cn(
                                        "relative group aspect-video bg-muted/40 rounded-xl overflow-hidden border transition-all cursor-pointer shadow-inner",
                                        activeSlideIndex === index ? "border-primary ring-2 ring-primary/20 scale-95" : "border-subtle"
                                    )}
                                >
                                    <img
                                        src={field.url}
                                        alt="preview"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        onLoad={(e) => handleImageLoad(field.url, e)}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="destructive"
                                            className="h-8 w-8 rounded-full"
                                            onClick={() => removeMedia(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-subtle rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                {uploading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary" />}
                                <span className="text-[10px] mt-2 font-medium text-muted-foreground group-hover:text-primary uppercase tracking-wider text-center">{t('admin.form.uploadImages')}</span>
                                <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, false)} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-subtle/50">
                        <Label className="text-muted-foreground mb-2 block">{t('admin.form.videoUrl')} (YouTube)</Label>
                        <div className="flex gap-2">
                            <Input placeholder={t('admin.form.videoPlaceholder')} id="video-url-input" className="bg-background/50" />
                            <Button type="button" variant="secondary" onClick={() => {
                                const input = document.getElementById('video-url-input') as HTMLInputElement;
                                if (input.value) {
                                    appendMedia({ type: 'video', url: input.value });
                                    input.value = '';
                                }
                            }}>{t('admin.form.add')}</Button>
                        </div>
                    </div>
                </div>

                {/* 3. Dynamic Content (Tabs for RU/EN) */}
                <div className="space-y-4 border p-6 rounded-2xl bg-surface/30 backdrop-blur-sm border-subtle">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Type className="w-5 h-5" />
                            <h3 className="font-bold text-lg">{t('admin.form.localizedContent')}</h3>
                        </div>
                    </div>

                    <Tabs defaultValue="en" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="en">{t('admin.form.english')}</TabsTrigger>
                            <TabsTrigger value="ru">{t('admin.form.russian')}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="en" className="space-y-4 mt-0 border-none p-0">
                            <div className="space-y-2">
                                <Label>{t('admin.form.name')}</Label>
                                <Input {...register('name.en', { required: true })} placeholder={t('admin.form.namePlaceholderEn')} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('admin.form.shortDesc')}</Label>
                                <Textarea {...register('shortDescription.en')} placeholder={t('admin.form.descPlaceholderEn')} className="min-h-[100px]" />
                            </div>
                        </TabsContent>

                        <TabsContent value="ru" className="space-y-4 mt-0 border-none p-0">
                            <div className="space-y-2">
                                <Label>{t('admin.form.name')}</Label>
                                <Input {...register('name.ru', { required: true })} placeholder={t('admin.form.namePlaceholderRu')} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('admin.form.shortDesc')}</Label>
                                <Textarea {...register('shortDescription.ru')} placeholder={t('admin.form.descPlaceholderRu')} className="min-h-[100px]" />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* 4. Custom Buttons Section */}
                <div className="space-y-4 border p-6 rounded-2xl bg-surface/30 backdrop-blur-sm border-subtle">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Plus className="w-5 h-5" />
                            <h3 className="font-bold text-lg">{t('admin.form.buttonsCount')}</h3>
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-mono border border-primary/20">
                                {buttonFields.length}/3
                            </span>
                        </div>
                        {buttonFields.length < 3 && (
                            <Button type="button" size="sm" variant="outline" className="rounded-full px-4" onClick={() => appendButton({ url: '', label: { en: 'Link', ru: 'Ссылка' }, icon: 'external' })}>
                                <Plus className="w-4 h-4 mr-2" /> {t('admin.form.addButton')}
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {buttonFields.map((field, index) => (
                            <div key={field.id} className="p-5 bg-background/40 rounded-2xl space-y-4 border border-subtle relative group/btn">
                                <Button type="button" size="icon" variant="ghost" className="absolute top-4 right-4 h-8 w-8 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-full" onClick={() => removeButton(index)}>
                                    <X className="w-4 h-4" />
                                </Button>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('admin.form.url')}</Label>
                                            <Input {...register(`buttons.${index}.url`)} placeholder="https://..." className="h-9 px-3" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('admin.form.icon')}</Label>
                                            <select
                                                {...register(`buttons.${index}.icon`)}
                                                className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm ring-offset-background outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                            >
                                                {AVAILABLE_ICONS.map(icon => (
                                                    <option key={icon} value={icon}>{icon}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-subtle/50">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('admin.form.labelEn')}</Label>
                                        <Input {...register(`buttons.${index}.label.en`)} placeholder="Learn More" className="h-9" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('admin.form.labelRu')}</Label>
                                        <Input {...register(`buttons.${index}.label.ru`)} placeholder="Подробнее" className="h-9" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Previews & Actions */}
            <div className="hidden xl:flex flex-col w-[450px] 2xl:w-[600px] space-y-6">
                <div className="flex-1 overflow-y-auto max-h-[80vh] space-y-6 pr-2 scrollbar-thin scrollbar-thumb-subtle">
                    {/* Preview Toggle & Card */}
                    <div className="space-y-4">
                        <div className="bg-surface/30 p-1 rounded-full border border-subtle flex relative">
                            {/* ... buttons for en/ru ... */}
                            <button
                                type="button"
                                onClick={() => setPreviewLang('en')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                    previewLang === 'en'
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                English
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewLang('ru')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                    previewLang === 'ru'
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Русский
                            </button>
                        </div>

                        <div className="w-full relative overflow-hidden transition-all duration-500 rounded-2xl shadow-2xl border border-subtle bg-neutral-950">
                            <div
                                className={cn(
                                    "w-full h-[500px] cursor-move select-none relative group/preview",
                                    isDragging && "cursor-grabbing",
                                    isResizing && "cursor-nwse-resize"
                                )}
                                onMouseDown={handleDragStart}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {/* Photoshop-style Canvas Border & Handles - Sync with content transform and ratio */}
                                <div
                                    className="absolute pointer-events-none z-20 opacity-0 group-hover/preview:opacity-100 transition-opacity border-2 border-primary/40 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-primary/5"
                                    style={{
                                        ...getFrameStyles(),
                                        transform: `
                                            translate(${formValues.media?.[activeSlideIndex]?.translate?.x || 0}px, ${formValues.media?.[activeSlideIndex]?.translate?.y || 0}px)
                                            scale(${formValues.media?.[activeSlideIndex]?.scale || 1})
                                        `,
                                        transformOrigin: 'center'
                                    }}
                                >
                                    {/* Corner Handles */}
                                    <div
                                        className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-primary border border-white rounded-sm pointer-events-auto cursor-nwse-resize hover:scale-125 transition-transform"
                                        onMouseDown={handleResizeStart}
                                    />
                                    <div
                                        className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-primary border border-white rounded-sm pointer-events-auto cursor-nesw-resize hover:scale-125 transition-transform"
                                        onMouseDown={handleResizeStart}
                                    />
                                    <div
                                        className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-primary border border-white rounded-sm pointer-events-auto cursor-nesw-resize hover:scale-125 transition-transform"
                                        onMouseDown={handleResizeStart}
                                    />
                                    <div
                                        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-primary border border-white rounded-sm pointer-events-auto cursor-nwse-resize hover:scale-125 transition-transform"
                                        onMouseDown={handleResizeStart}
                                    />

                                    {/* Visual corners */}
                                    <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary" />
                                    <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary" />
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary" />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary" />
                                </div>

                                <GalleryCard
                                    key={previewLang} // Force re-render on lang change for animation
                                    project={{
                                        ...formValues,
                                        buttons: formValues.buttons || [],
                                        media: formValues.media || [],
                                        technologies: formValues.technologies || []
                                    }}
                                    forcedLanguage={previewLang}
                                    forceHover={true}
                                    hideEditButton={true}
                                    setCarouselApi={setPreviewApi}
                                    disableGestures={true}
                                    className="min-h-[0px] h-full w-full pointer-events-none"
                                />
                            </div>

                            {/* Transformation Toolbar */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-6 z-50 shadow-2xl min-w-[300px]">
                                <div className="flex flex-col gap-1 flex-1">
                                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-white/50">
                                        <span>Scale / Zoom</span>
                                        <span className="text-primary">{Math.round((formValues.media?.[activeSlideIndex]?.scale || 1) * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="5"
                                        step="0.01"
                                        value={formValues.media?.[activeSlideIndex]?.scale || 1}
                                        onChange={(e) => updateScale([parseFloat(e.target.value)])}
                                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                                <div className="h-8 w-px bg-white/10" />
                                <div className="text-[10px] uppercase tracking-widest font-bold text-white/50 whitespace-nowrap">
                                    Pan Enabled
                                </div>
                            </div>

                            {/* Help Overlay */}
                            {!isDragging && (
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white/80 pointer-events-none flex items-center gap-2 border border-white/10 z-50">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    TRANSFORM MODE: DRAG TO PAN | SLIDER TO ZOOM
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Actions (Moved from Sticky Footer) */}
                <div className="flex flex-col gap-3 mt-auto pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting || uploading}
                        className="w-full rounded-2xl h-12 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 font-bold transition-all active:scale-95"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                {t('admin.form.saving')}
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-3" />
                                {t('admin.form.save')}
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full rounded-2xl h-10 text-muted-foreground hover:bg-muted/30"
                        onClick={onCancel}
                    >
                        {t('admin.dashboard.cancel')}
                    </Button>
                </div>
            </div>
        </form>
    );
};
