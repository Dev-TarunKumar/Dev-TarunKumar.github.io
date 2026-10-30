/**
 * Shared Tailwind CSS Configuration for Tarun's Portfolio & Blog
 * Unified across index.html, projects.html, blog.html, connect.html, and post.html
 */
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#dc3c19', // Kinetic Coral - WCAG AA compliant (>4.5:1 on white)
            hover: '#b52603',
            container: '#ff5a36',
            light: '#fff1ee',
            dark: '#3d0600',
          },
          secondary: {
            DEFAULT: '#4b41e1', // Electric Indigo
            hover: '#3b32b8',
            container: '#645efb',
            light: '#eef2ff',
            dark: '#1e1b4b',
          },
          tertiary: {
            DEFAULT: '#00668a',
            container: '#009dd3',
            light: '#e0f2fe',
            dark: '#002f42',
          },
          surface: {
            DEFAULT: '#faf9f6',
            dim: '#cfdaf2',
            canvas: '#faf9f6',
            container: '#f0f3ff',
            dark: '#0b1120',
            'card-dark': '#151f32',
          },
          slate: {
            850: '#151f32',
            950: '#070b14',
          }
        },
        fontFamily: {
          sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
          display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
          body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
          mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        },
        borderRadius: {
          '2xl': '1rem',
          '3xl': '1.5rem',
          '4xl': '2rem',
        },
        boxShadow: {
          'subtle': '0 4px 20px -2px rgba(30, 41, 59, 0.05), 0 2px 6px -1px rgba(30, 41, 59, 0.03)',
          'hover': '0 20px 35px -10px rgba(220, 60, 25, 0.14), 0 8px 16px -4px rgba(30, 41, 59, 0.04)',
          'card-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.4)',
        }
      }
    }
  };
}
