import { useSyncExternalStore } from "react";

export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();

  const get = () => state;
  const set = (patch: Partial<T>) => {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  };
  const reset = () => {
    state = initial;
    listeners.forEach((listener) => listener());
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const use = () => useSyncExternalStore(subscribe, get, get);

  return { get, set, reset, use };
}
