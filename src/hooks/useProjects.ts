import { useQuery } from '@tanstack/react-query';
import { Project } from '@/types/project';
import { fetchProjects } from '@/services/projects';

export const useProjects = () => {
    const {
        data: projects = [],
        isLoading: loading,
        error,
        refetch
    } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
                console.error("Supabase credentials missing.");
                return [];
            }
            return await fetchProjects();
        }
    });

    return { projects, loading, error: error as Error | null, refetch };
};
