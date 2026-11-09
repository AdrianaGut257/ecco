import { createStore } from "./createStore";

// Color de fondo que queda detrás de la muesca y las esquinas de la barra de pestañas.
// Sin color propio (null) se usa el fondo de la app; las pantallas con paisaje lo cambian mientras están enfocadas.
const store = createStore<{ color: string | null }>({ color: null });

export const tabBarBackdrop = {
  use: store.use,
  set: (color: string) => store.set({ color }),
  reset: () => store.set({ color: null }),
};
