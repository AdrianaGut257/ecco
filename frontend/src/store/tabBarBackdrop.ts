import { colors } from "../constants/colors";
import { createStore } from "./createStore";

// Color de fondo que queda detrás de la muesca y las esquinas de la barra de pestañas.
// Las pantallas con fondo blanco (Scenery) lo cambian mientras están enfocadas.
const store = createStore<{ color: string }>({ color: colors.primary.light });

export const tabBarBackdrop = {
  use: store.use,
  set: (color: string) => store.set({ color }),
  reset: () => store.set({ color: colors.primary.light }),
};
