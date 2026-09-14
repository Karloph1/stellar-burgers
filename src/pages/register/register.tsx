import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import { TRegisterData } from '@api';
import { Navigate, useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData: TRegisterData = {
        email: email,
        name: userName,
        password: password
      };
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        console.log('Регистрация успешна, пользователь:', resultAction.payload);

        navigate('/profile', { replace: true });
      } else {
        console.error('Ошибка регистрации:', resultAction.payload);
      }
    } catch (err) {
      console.error('Неожиданная ошибка:', err);
    }
  };
  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
