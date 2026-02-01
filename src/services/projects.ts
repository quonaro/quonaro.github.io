
import { supabase } from '@/lib/supabase';
import { Project } from '@/types/project';

export const fetchProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }

    return data as Project[];
};

export const createProject = async (project: Project) => {
    const { error } = await supabase
        .from('projects')
        .insert(project);

    if (error) throw error;
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
    const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id);

    if (error) throw error;
};

export const deleteProject = async (id: string) => {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

export const uploadProjectMedia = async (file: File) => {
    // Generate a clean filename: timestamp + random string + extension
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const { data, error } = await supabase.storage
        .from('project-media')
        .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('project-media')
        .getPublicUrl(fileName);

    return publicUrl;
};
