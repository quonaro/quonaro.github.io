export const PROJECT_BUTTON_ICONS = {
    GITHUB: 'github',
    EXTERNAL: 'external',
    DOCS: 'docs',
    DOWNLOAD: 'download',
    PLAY: 'play',
    YOUTUBE: 'youtube',
    FIGMA: 'figma',
    BOOK: 'book',
    MONITOR: 'monitor',
} as const;

export type ProjectButtonIcon = typeof PROJECT_BUTTON_ICONS[keyof typeof PROJECT_BUTTON_ICONS];

export const PROJECT_LABEL_KEYS = {
    DOWNLOAD: 'common.download',
    DEMO: 'common.demo',
    DOCS: 'common.docs',
    WATCH: 'common.watch',
    READ: 'common.read',
    DESIGN: 'common.design',
} as const;


export type ProjectLabelKey = typeof PROJECT_LABEL_KEYS[keyof typeof PROJECT_LABEL_KEYS];
