/**
 * Icon-Set als Inline-SVG (keine Icon-Library, damit die App offline und
 * schlank bleibt). Alle Icons nutzen currentColor und stroke-basierte Pfade.
 */

const PATHS = {
  brain: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 5 3 3 0 0 0 4 3V4Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 5 3 3 0 0 1-4 3V4Z',
  numbers: 'M4 8h16M4 16h16M9 4 7 20M17 4l-2 16',
  letters: 'M4 20 9 5l5 15M6 15h6M17 20V9m0 0-3 3m3-3 3 3',
  logic: 'M12 3v6m0 6v6M3 12h6m6 0h6M8 8l8 8M16 8l-8 8',
  chart: 'M4 19V5m0 14h16M8 15l3-4 3 3 4-6',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8.4-3a8.4 8.4 0 0 0-.1-1.2l2-1.5-2-3.4-2.3 1a8.5 8.5 0 0 0-2-1.2l-.4-2.4H10.4L10 5.7a8.5 8.5 0 0 0-2 1.2l-2.3-1-2 3.4 2 1.5a8.4 8.4 0 0 0 0 2.4l-2 1.5 2 3.4 2.3-1a8.5 8.5 0 0 0 2 1.2l.4 2.4h3.2l.4-2.4a8.5 8.5 0 0 0 2-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-9v5m0-9v.5',
  play: 'm7 4 12 8-12 8V4Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3.5 2',
  check: 'm5 13 4 4L19 7',
  close: 'M6 6l12 12M18 6 6 18',
  chevronRight: 'm9 5 7 7-7 7',
  chevronLeft: 'm15 5-7 7 7 7',
  flame: 'M12 3c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.3-2-.8-2.8C17 9 19 11.5 19 14.5A7 7 0 0 1 5 15c0-4 3-6 4-8 .6-1.3 2.4-3 3-4Z',
  trophy: 'M8 4h8v5a4 4 0 1 1-8 0V4Zm0 2H5a3 3 0 0 0 3 3m8-3h3a3 3 0 0 1-3 3m-4 5v4m-3 0h6',
  refresh: 'M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5',
  cards: 'M4 8a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm4-4h9a3 3 0 0 1 3 3v9',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-3.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z',
  pause: 'M9 5v14M15 5v14',
  shapes: 'M4 4h7v7H4V4Zm9 9h7v7h-7v-7Zm-9 3h7v4H4v-4Zm9-12h7v5h-7V4Z',
};

export function Icon({ name, className = 'h-6 w-6', strokeWidth = 1.8, ...rest }) {
  const path = PATHS[name] ?? PATHS.info;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={path} />
    </svg>
  );
}

export default Icon;
