// atoms/authScreenAtom.js
import { atom } from 'recoil';

export const authScreenAtom = atom({
  key: 'authScreenAtom',
  default: 'login',          // "login" | "signup"
});