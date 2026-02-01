import { useEffect, useState } from 'react';
import { Project } from '@/types/project';
import { fetchProjects } from '@/services/projects';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
                    console.error("Supabase credentials missing.");
                    setLoading(false);
                    return;
                }

                const data = await fetchProjects();
                if (data) {
                    setProjects(data);
                }
            } catch (err) {
                console.error("Failed to load projects from Supabase", err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    return { projects, loading, error };
};
