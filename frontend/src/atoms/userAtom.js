import { atom } from 'recoil';

const STORAGE_KEY = 'libris-user';

export const userAtom = atom({
  key: 'userAtom',
  default: JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null,
  effects: [
    ({ onSet }) =>
      onSet((val) => {
        if (val) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }),
  ],
});
