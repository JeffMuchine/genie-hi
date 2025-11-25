export const theme = {
    colors: {
        primary: '#6F38C5', // Deep Purple
        secondary: '#87A2FB', // Soft Blue
        accent: '#FFD93D', // Yellow/Gold for highlights
        background: '#F8F9FA', // Light Gray
        surface: '#FFFFFF', // White
        text: {
            primary: '#1A1A1A',
            secondary: '#666666',
            light: '#FFFFFF',
        },
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        border: '#E0E0E0',
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.75rem',
        h4: '1.5rem',
        body1: '1rem',
        body2: '0.875rem',
        caption: '0.75rem',
    },
    spacing: (factor: number) => `${factor * 8}px`,
    borderRadius: {
        small: '4px',
        medium: '8px',
        large: '16px',
        round: '50%',
    },
    shadows: {
        small: '0 2px 4px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
        large: '0 8px 16px rgba(0, 0, 0, 0.1)',
    },
    breakpoints: {
        mobile: '576px',
        tablet: '768px',
        desktop: '992px',
    },
};

export type Theme = typeof theme;
