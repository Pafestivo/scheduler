'use client';
import { postData } from '@/utilities/serverRequests/serverRequests';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoginForm from './components/LoginForm';

const Login = () => {
  const [error, setError] = useState(null); // [1
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    try {
      const res = await postData('/auth/login', { email, password });
      router.push('/');
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };
  return (
    <>
      <LoginForm />
    </>
  );
};

export default Login;
