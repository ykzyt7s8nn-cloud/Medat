/** Untere Tab-Leiste mit vier Tabs. */
import Tappable from '../ui/Tappable.jsx';
import Icon from '../ui/Icon.jsx';
import { useNavigation } from '../../store/useNavigation.js';

const TABS = [
  { id: 'practice', label: 'KFF', icon: 'play' },
  { id: 'bms', label: 'BMS', icon: 'book' },
  { id: 'stats', label: 'Statistik', icon: 'chart' },
  { id: 'settings', label: 'Einstellungen', icon: 'gear' },
  { id: 'info', label: 'Info', icon: 'info' },
];

export function TabBar() {
  const tab = useNavigation((state) => state.tab);
  const setTab = useNavigation((state) => state.setTab);

  return (
    <nav
      aria-label="Hauptnavigation"
      className="border-t border-black/5 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-night-secondary/85"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <ul className="flex">
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <li key={item.id} className="flex-1">
              <Tappable
                onClick={() => setTab(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-0.5 py-2 ${
                  active ? 'text-ios-blue' : 'text-black/45 dark:text-white/45'
                }`}
              >
                <Icon name={item.icon} className="h-6 w-6" strokeWidth={active ? 2.1 : 1.7} />
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
              </Tappable>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default TabBar;
