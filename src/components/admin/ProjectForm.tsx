
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Upload, Loader2, Plus, Tags, Image as ImageIcon, Layout, Type, Save } from 'lucide-react';
import { compressImage } from '@/utils/media-compression';
import { uploadProjectMedia } from '@/services/projects';
import { toast } from 'sonner';
import { GalleryCard } from '@/components/GalleryCard';

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (data: Project) => Promise<void>;
    onCancel: () => void;
}

const AVAILABLE_ICONS = ['github', 'external', 'docs', 'download', 'play', 'youtube', 'figma', 'book', 'monitor'];

export const ProjectForm = ({ initialData, onSubmit, onCancel }: ProjectFormProps) => {
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);

    // Normalization helper for legacy data
    const normalizeLocalField = (field: any) => {
        if (typeof field === 'string') return { en: field, ru: field };
        return field || { en: '', ru: '' };
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

    const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
        control,
        name: "media"
    });

    const { fields: buttonFields, append: appendButton, remove: removeButton } = useFieldArray({
        control,
        name: "buttons"
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const compressed = await compressImage(file);
                const url = await uploadProjectMedia(compressed);
                appendMedia({ type: 'image', url });
            }
            toast.success(t('admin.form.successCreated')); // reused for generic success or could add specific one
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

                {/* 2. Dynamic Content (Tabs for RU/EN) */}
                <div className="space-y-4 border p-6 rounded-2xl bg-surface/30 backdrop-blur-sm border-subtle">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Type className="w-5 h-5" />
                            <h3 className="font-bold text-lg">{t('admin.form.localizedContent')}</h3>
                        </div>
                    </div>

                    <Tabs defaultValue="en" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="en">🇺🇸 {t('admin.form.english')}</TabsTrigger>
                            <TabsTrigger value="ru">🇷🇺 {t('admin.form.russian')}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="en" className="space-y-4 mt-0 border-none p-0">
                            <div className="space-y-2">
                                <Label>{t('admin.form.name')} 🇺🇸</Label>
                                <Input {...register('name.en', { required: true })} placeholder={t('admin.form.namePlaceholderEn')} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('admin.form.shortDesc')} 🇺🇸</Label>
                                <Textarea {...register('shortDescription.en')} placeholder={t('admin.form.descPlaceholderEn')} className="min-h-[100px]" />
                            </div>
                        </TabsContent>

                        <TabsContent value="ru" className="space-y-4 mt-0 border-none p-0">
                            <div className="space-y-2">
                                <Label>{t('admin.form.name')} 🇷🇺</Label>
                                <Input {...register('name.ru', { required: true })} placeholder={t('admin.form.namePlaceholderRu')} />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('admin.form.shortDesc')} 🇷🇺</Label>
                                <Textarea {...register('shortDescription.ru')} placeholder={t('admin.form.descPlaceholderRu')} className="min-h-[100px]" />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* 3. Media Section */}
                <div className="space-y-4 border p-6 rounded-2xl bg-surface/30 backdrop-blur-sm border-subtle">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <ImageIcon className="w-5 h-5" />
                        <h3 className="font-bold text-lg">{t('admin.form.media')}</h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {mediaFields.map((field, index) => (
                            <div key={field.id} className="relative group aspect-video bg-muted/40 rounded-xl overflow-hidden border border-subtle shadow-inner">
                                <img src={field.url} alt="preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                            <span className="text-[10px] mt-2 font-medium text-muted-foreground group-hover:text-primary uppercase tracking-wider">{t('admin.form.uploadImages')}</span>
                            <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
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

                {/* 4. Custom Buttons Section */}
                <div className="space-y-4 border p-6 rounded-2xl bg-surface/30 backdrop-blur-sm border-subtle">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Plus className="w-5 h-5" />
                            <h3 className="font-bold text-lg">{t('admin.form.buttonsCount')}</h3>
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
                                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('admin.form.labelEn')} 🇺🇸</Label>
                                        <Input {...register(`buttons.${index}.label.en`)} placeholder="Learn More" className="h-9" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('admin.form.labelRu')} 🇷🇺</Label>
                                        <Input {...register(`buttons.${index}.label.ru`)} placeholder="Подробнее" className="h-9" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Previews & Actions */}
            <div className="hidden xl:flex flex-col w-[400px] 2xl:w-[500px] space-y-6">
                <div className="flex-1 overflow-y-auto max-h-[80vh] space-y-6 pr-2 scrollbar-thin scrollbar-thumb-subtle">
                    {/* RU Preview */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between pb-1 border-b border-subtle">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                {t('admin.form.ruPreview')}
                            </h3>
                        </div>
                        <div className="bg-surface/20 border border-subtle rounded-3xl p-4 flex items-center justify-center shadow-xl relative overflow-hidden">
                            <div className="w-full h-[320px] flex">
                                <GalleryCard project={{
                                    ...formValues,
                                    buttons: formValues.buttons || [],
                                    media: formValues.media || [],
                                    technologies: formValues.technologies || []
                                }} forcedLanguage="ru" />
                            </div>
                        </div>
                    </div>

                    {/* EN Preview */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between pb-1 border-b border-subtle">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                {t('admin.form.enPreview')}
                            </h3>
                        </div>
                        <div className="bg-surface/20 border border-subtle rounded-3xl p-4 flex items-center justify-center shadow-xl relative overflow-hidden">
                            <div className="w-full h-[320px] flex">
                                <GalleryCard project={{
                                    ...formValues,
                                    buttons: formValues.buttons || [],
                                    media: formValues.media || [],
                                    technologies: formValues.technologies || []
                                }} forcedLanguage="en" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface/30 p-4 rounded-2xl border border-subtle">
                        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                            {t('admin.form.previewDesc')}
                        </p>
                    </div>
                </div>

                {/* Actions (Moved from Sticky Footer) */}
                <div className="bg-surface/50 backdrop-blur-md p-6 rounded-3xl border border-primary/20 shadow-2xl flex flex-col gap-3">
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
