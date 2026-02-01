export interface ProjectMedia {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string; // For video placeholder
}

export interface ProjectLinks {
    demo?: string;
    github?: string;
    docs?: string;
}

export interface ProjectButton {
    labelKey?: string; // Legacy support
    label?: {
        en: string;
        ru: string;
    };
    url: string;
    icon?: 'github' | 'external' | 'docs' | 'download' | 'play' | 'youtube' | 'figma' | 'book' | 'monitor';
}

export interface Project {
    id: string;
    name: {
        en: string;
        ru: string;
    };
    links: ProjectLinks;
    buttons?: ProjectButton[];
    shortDescription: {
        en: string;
        ru: string;
    };
    technologies: string[];
    media?: ProjectMedia[];
}
