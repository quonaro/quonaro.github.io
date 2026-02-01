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
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
                return;
            }
            loadProjects();
            setLoading(false);
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

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
        navigate('/login');
    };

    const handleCreate = async (data: Project) => {
        try {
            await createProject(data);
            toast.success(t('admin.form.successCreated', 'Project created'));
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
            toast.success(t('admin.form.successUpdated', 'Project updated'));
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
            toast.success(t('admin.form.successDeleted', 'Project deleted'));
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
                    <Button onClick={openCreateForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        {t('admin.dashboard.newProject')}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="group bg-surface border border-subtle rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
                            <div className="aspect-video bg-muted relative">
                                {project.media && project.media.length > 0 ? (
                                    <img src={project.media[0].url} alt={project.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">{t('admin.dashboard.noMedia')}</div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold mb-1">
                                    {typeof project.name === 'object' ? (project.name[i18n.language as 'en' | 'ru'] || project.name.en) : project.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2" title={typeof project.shortDescription === 'object' ? project.shortDescription.en : project.shortDescription}>
                                    {typeof project.shortDescription === 'object' ? (project.shortDescription[i18n.language as 'en' | 'ru'] || project.shortDescription.en) : project.shortDescription}
                                </p>

                                <div className="mt-4 flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => window.open(project.links.demo || project.links.github, '_blank')}>
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => openEditForm(project)} title={t('admin.dashboard.edit')}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="destructive" className="h-8 w-8" title={t('admin.dashboard.delete')}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{t('admin.dashboard.confirmDeleteTitle')}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t('admin.dashboard.confirmDeleteDesc')}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>{t('admin.dashboard.cancel')}</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(project.id)}>{t('admin.dashboard.delete')}</AlertDialogAction>
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
