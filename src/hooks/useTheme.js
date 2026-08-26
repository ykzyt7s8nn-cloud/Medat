/**
 * Dark-Mode-Steuerung.
 *
 * 'system' folgt der iOS-Einstellung, 'light'/'dark' erzwingen ein Erscheinungs-
 * bild. Tailwind ist auf darkMode: 'class' konfiguriert – gesetzt wird die
 * Klasse am <html>-Element.
 */
import { useEffect } from 'react';
import { useSettings } from '../store/useSettings.js';

export function useTheme() {
  const theme = useSettings((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches);
      root.classList.toggle('dark', dark);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? '#000000' : '#F2F2F7');
    };

    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  return theme;
}
