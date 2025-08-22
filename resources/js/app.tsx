import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { TourProvider } from './tour/TourProvider';

// tangkap Pages/ dan pages/
const pages = import.meta.glob(['./pages/**/*.tsx','./Pages/**/*.tsx'], { eager: true });

createInertiaApp({
  resolve: (name) => pages[`./pages/${name}.tsx`] ?? pages[`./Pages/${name}.tsx`],
  setup({ el, App, props }) {
    createRoot(el).render(
      <TourProvider>
        <App {...props} />
      </TourProvider>
    );
  },
  progress: { color: '#4B5563' },
});
