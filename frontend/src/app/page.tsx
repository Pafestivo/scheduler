'use client';

import { getData, postData } from '@/utilities/serverRequests/serverRequests';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const data = useSession();
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    // fix unnecessary re-rendering
    const getUser = async () => {
      if (loggedUser) return; // Break infinite loop by checking if a user is already logged in
      const user = await getData('/auth/me');
      setLoggedUser(user);
    };

    const registerUser = async () => {
      if (data.data?.user && !loggedUser) {
        const { email, name } = data.data?.user;
        await postData('/auth/register', { email, name });
        getUser(); // Call getUser after registering the user
      }
    };

    const initialize = async () => {
      await registerUser(); // Register the user and call getUser after registration
    };

    initialize();
  }, [data.data?.user, loggedUser]);

  return (
    <div>
      {loggedUser ? <p>user is logged in</p> : <p>no user logged in</p>}
      <h1>Home Page</h1>
    </div>
  );
};

export default HomePage;
