import { useState, useEffect } from 'react';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  default_branch: string;
  updated_at: string;
  has_pages?: boolean;
}

interface UseGitHubReposResult {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

/**
 * Хук для получения репозиториев с GitHub Pages из GitHub API
 * @param username - GitHub username
 * @param onlyWithPages - Показывать только репозитории с GitHub Pages
 */
export const useGitHubRepos = (
  username: string = 'quonaro',
  onlyWithPages: boolean = true
): UseGitHubReposResult => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);
        setError(null);

        // Получаем все публичные репозитории
        // GitHub API поддерживает CORS для публичных данных
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=all`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );

        if (!response.ok) {
          // Обработка rate limiting
          if (response.status === 403) {
            const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
            if (rateLimitRemaining === '0') {
              throw new Error('GitHub API rate limit exceeded. Please try again later.');
            }
          }
          throw new Error(`Failed to fetch repos: ${response.statusText}`);
        }

        const data: GitHubRepo[] = await response.json();

        // Фильтруем репозитории
        let filteredRepos = data;

        if (onlyWithPages) {
          // Фильтруем репозитории с GitHub Pages
          // Оптимизация: используем только homepage для определения GitHub Pages
          // Это избегает множественных запросов и проблем с rate limiting
          const reposWithPages = data.filter((repo) => {
            // Если есть homepage, скорее всего это GitHub Pages
            if (repo.homepage) {
              return true;
            }
            // Также проверяем стандартные паттерны GitHub Pages
            // Репозитории вида username.github.io всегда имеют Pages
            return repo.name.includes('.github.io') || repo.name === username;
          });

          filteredRepos = reposWithPages.map((repo) => ({ ...repo, has_pages: true }));
        }

        // Сортируем по дате обновления (самые свежие первыми)
        filteredRepos.sort(
          (a, b) =>
            new Date(b.updated_at || 0).getTime() -
            new Date(a.updated_at || 0).getTime()
        );

        setRepos(filteredRepos);
      } catch (err) {
        let errorMessage = 'Unknown error';
        
        if (err instanceof TypeError && err.message.includes('fetch')) {
          // CORS или сетевые ошибки
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        console.error('Error fetching GitHub repos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username, onlyWithPages]);

  return { repos, loading, error };
};

