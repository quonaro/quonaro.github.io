export interface ProjectMedia {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string; // For video placeholder
    objectFit?: 'cover' | 'contain';
    translate?: { x: number; y: number };
    scale?: number;
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

export interface ProjectCoverConfig {
    type: 'image' | 'generated';
    gradient?: string;
    text?: { en: string; ru: string };
}

export interface Project {
    id: string;
    name: {
        en: string;
        ru: string;
    };
    links?: ProjectLinks;
    buttons?: ProjectButton[];
    shortDescription: {
        en: string;
        ru: string;
    };
    technologies: string[];
    media?: ProjectMedia[];
    cover_image?: string;
    cover_config?: ProjectCoverConfig;
    is_in_gallery?: boolean;
}
