import { atom } from "jotai";

import { History } from "../types/history";

export const historiesAtom = atom<Array<History>>([]);
