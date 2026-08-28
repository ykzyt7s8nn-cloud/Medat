/**
 * App-Wurzel.
 *
 * Aufbau: ein Tab-Inhalt plus optional ein Vollbild-Screen (Untertest oder
 * Simulation), der darüber gelegt wird. Die Untertests werden per lazy() erst
 * beim Öffnen geladen.
 */
import { Suspense, lazy } from 'react';
import TabBar from './components/layout/TabBar.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import StatsScreen from './screens/StatsScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';
import InfoScreen from './screens/InfoScreen.jsx';
import { useNavigation } from './store/useNavigation.js';
import { useTheme } from './hooks/useTheme.js';

const FiguresTest = lazy(() => import('./screens/tests/FiguresTest.jsx'));
const MemoryTest = lazy(() => import('./screens/tests/MemoryTest.jsx'));
const NumberSeriesTest = lazy(() => import('./screens/tests/NumberSeriesTest.jsx'));
const WordFluencyTest = lazy(() => import('./screens/tests/WordFluencyTest.jsx'));
const ImplicationsTest = lazy(() => import('./screens/tests/ImplicationsTest.jsx'));
const SimulationScreen = lazy(() => import('./screens/SimulationScreen.jsx'));
const TrainingScreen = lazy(() => import('./screens/TrainingScreen.jsx'));

const FULLSCREENS = {
  figures: FiguresTest,
  memory: MemoryTest,
  numberSeries: NumberSeriesTest,
  wordFluency: WordFluencyTest,
  implications: ImplicationsTest,
  simulation: SimulationScreen,
  training: TrainingScreen,
};

const TABS = {
  practice: HomeScreen,
  stats: StatsScreen,
  settings: SettingsScreen,
  info: InfoScreen,
};

function Loading() {
  return (
    <div className="flex h-full items-center justify-center bg-surface-grouped dark:bg-night">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-black/10 border-t-ios-blue dark:border-white/15 dark:border-t-ios-blue" />
      <span className="sr-only">Wird geladen …</span>
    </div>
  );
}

export default function App() {
  useTheme();
  const tab = useNavigation((state) => state.tab);
  const screen = useNavigation((state) => state.screen);

  const TabComponent = TABS[tab] ?? HomeScreen;
  const FullScreen = screen ? FULLSCREENS[screen.name] : null;

  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-[560px] flex-col overflow-hidden bg-surface-grouped shadow-raised dark:bg-night">
      {FullScreen ? (
        <div className="h-full animate-fade-in">
          <Suspense fallback={<Loading />}>
            <FullScreen {...screen.params} />
          </Suspense>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1">
            <TabComponent />
          </div>
          <TabBar />
        </>
      )}
    </div>
  );
}
