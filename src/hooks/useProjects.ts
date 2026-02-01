import { useEffect, useState } from 'react';
import { Project } from '@/types/project';
import { fetchProjects } from '@/services/projects';
import projectsData from '../../projects.json';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>(projectsData as Project[]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadProjects = async () => {
            const dataSource = import.meta.env.VITE_DATA_SOURCE;

            if (dataSource === 'json') {
                console.log('Using local JSON data');
                setProjects(projectsData as Project[]);
                setLoading(false);
                return;
            }

            // Default to Supabase if not explicitly 'json'
            try {
                if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
                    console.warn("Supabase credentials missing, falling back to local JSON.");
                    setProjects(projectsData as Project[]);
                    setLoading(false);
                    return;
                }

                const data = await fetchProjects();
                if (data) {
                    setProjects(data);
                }
            } catch (err) {
                console.error("Failed to load projects from Supabase, falling back to local JSON", err);
                setError(err as Error);
                // Keep local JSON as fallback
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    return { projects, loading, error };
};
