import React from 'react';
import { useRecoilValue } from 'recoil';
import { authScreenAtom } from '../atoms/authScreenAtom.js';
import LoginCard from '../components/LoginCard';
import SignupCard from '../components/SignupCard';

const AuthPage = () => {
  const screen = useRecoilValue(authScreenAtom);

  return screen === 'login' ? <LoginCard /> : <SignupCard />;
};

export default AuthPage;
