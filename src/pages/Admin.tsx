import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Project } from '@/types/project';
import { fetchProjects, createProject, updateProject, deleteProject } from '@/services/projects';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AdminPage = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

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

    useEffect(() => {
        loadProjects();
        setLoading(false);
    }, []);

    const loadProjects = async () => {
        try {
            const data = await fetchProjects();
            setProjects(data);
        } catch (error) {
            console.error(error);
            toast.error(t('admin.dashboard.errorLoad'));
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const handleCreate = async (data: Project) => {
        try {
            await createProject(data);
            toast.success(t('admin.form.successCreated'));
            setIsFormOpen(false);
            loadProjects();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleUpdate = async (data: Project) => {
        try {
            const { id, ...updates } = data;
            await updateProject(id, updates);
            toast.success(t('admin.form.successUpdated'));
            setIsFormOpen(false);
            setEditingProject(undefined);
            loadProjects();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProject(id);
            toast.success(t('admin.form.successDeleted'));
            loadProjects();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const openCreateForm = () => {
        setEditingProject(undefined);
        setIsFormOpen(true);
    };

    const openEditForm = (project: Project) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };

    if (loading) return null;

    if (isFormOpen) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6">
                    {editingProject ? t('admin.form.editTitle') : t('admin.form.newTitle')}
                </h2>
                <ProjectForm
                    initialData={editingProject}
                    onSubmit={editingProject ? handleUpdate : handleCreate}
                    onCancel={() => setIsFormOpen(false)}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-subtle bg-surface/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold">{t('admin.dashboard.title')}</h1>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                            {t('admin.dashboard.viewSite')}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleSignOut} title={t('admin.dashboard.signOut')}>
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">{t('admin.dashboard.yourProjects')}</h2>
                    <Button onClick={openCreateForm} className="rounded-full px-6">
                        <Plus className="w-4 h-4 mr-2" />
                        {t('admin.dashboard.newProject')}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="group bg-surface border border-subtle rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5">
                            <div className="aspect-video bg-muted relative">
                                {project.media && project.media.length > 0 ? (
                                    <img src={project.media[0].url} alt={getLocalized(project.name)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">{t('admin.dashboard.noMedia')}</div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold mb-1">
                                    {getLocalized(project.name)}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]" title={getLocalized(project.shortDescription)}>
                                    {getLocalized(project.shortDescription)}
                                </p>

                                <div className="mt-6 flex justify-between items-center">
                                    <div className="flex gap-2">
                                        {(project.buttons && project.buttons.length > 0) && (
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-9 w-9 rounded-full"
                                                onClick={() => window.open(project.buttons![0].url, '_blank')}
                                                title="View"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="outline" className="h-9 w-9 rounded-full" onClick={() => openEditForm(project)} title={t('admin.dashboard.edit')}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="destructive" className="h-9 w-9 rounded-full" title={t('admin.dashboard.delete')}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-2xl">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{t('admin.dashboard.confirmDeleteTitle')}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t('admin.dashboard.confirmDeleteDesc')}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-full">{t('admin.dashboard.cancel')}</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(project.id)} className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">{t('admin.dashboard.delete')}</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
