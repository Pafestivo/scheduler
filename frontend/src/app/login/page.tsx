'use client';
import { postData } from '@/utilities/serverRequests/serverRequests';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
      <h1>Login page</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => signIn('google')}>Google</button>
    </>
  );
};

export default Login;
