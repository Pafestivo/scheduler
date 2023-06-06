'use client';

import { getData, postData } from '@/utilities/serverRequests/serverRequests';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const data = useSession();
  const [loggedUser, setLoggedUser] = useState<{ hash?: string }>({});

  useEffect(() => {
    // fix unnecessary re-rendering
    const getUser = async () => {
      if (loggedUser.hash) return; // Break infinite loop by checking if a user is already logged in
      const user = await getData('/auth/me');
      setLoggedUser(user.data);
    };

    const registerUser = async () => {
      if (data.data?.user && !loggedUser.hash) {
        const { email, name } = data.data?.user;
        const response = await postData('/auth/register', { email, name });
        if (response.message === 'User already exists') {
          await postData('/auth/login', { email, name, provider: true });
        }
      }
      getUser(); // Call getUser after registering the user
    };

    const initialize = async () => {
      await registerUser(); // Register the user and call getUser after registration
    };

    initialize();
  }, [data.data?.user, loggedUser]);

  return (
    <div>
      {loggedUser.hash ? <p>user is logged in</p> : <p>no user logged in</p>}
      <h1>Home Page</h1>
    </div>
  );
};

export default HomePage;
