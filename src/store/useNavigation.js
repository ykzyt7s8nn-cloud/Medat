/**
 * Navigation (nicht persistiert).
 *
 * Die App kommt ohne Router aus: ein Tab plus optional ein darüber liegender
 * Vollbild-Screen (Untertest oder Simulation). Das hält die Navigation
 * vorhersehbar und erlaubt es, laufende Übungen bewusst zu schützen.
 */
import { create } from 'zustand';

export const useNavigation = create((set) => ({
  tab: 'practice', // practice | stats | settings | info
  /** null oder { name: 'memory' | 'numberSeries' | ... | 'simulation', params } */
  screen: null,

  setTab: (tab) => set({ tab }),
  openScreen: (name, params = {}) => set({ screen: { name, params } }),
  closeScreen: () => set({ screen: null }),
}));
