import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { TLoginData } from '@api';
import { loginUser } from '../../services/slices/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let errorText = undefined;
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const loginData: TLoginData = { email, password };

    try {
      const resultAction = await dispatch(loginUser(loginData));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate('/profile', { replace: true });
      } else {
        console.error('Ошибка входа:', resultAction.payload);
        errorText = 'Неверный логин или пароль';
      }
    } catch (err) {
      console.error('Неожиданная ошибка:', err);
      errorText = 'Неожиданная ошибка';
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
