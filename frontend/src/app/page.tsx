'use client'
import { useEffect } from "react";
import { useGlobalContext } from "./context/store";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const { user } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if(user) {
      router.push('/dashboard');
    }
  }, [router, user])

  return (
    <div>
      <h1>Welcome to cortex {user?.name ? user.name : ''}!</h1>
      <div>
        {user?.name ? (
          <h1>Redirecting to your dashboard.</h1>
        ) : (
          <div>
            <p>This page is a work in progress, but you can still use our application!</p>
            <p>Click the user icon in the top right to register or login.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
