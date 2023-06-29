'use client'
import { useEffect } from "react";
import { useGlobalContext } from "./context/store";

const HomePage = () => {
  const { user } = useGlobalContext()

  useEffect(() => {
    setTimeout(() => {
      if(user) {
        window.location.href = '/dashboard'
      }
    }, 1000)
  }, [user])

  return (
    <div>
      <h1>Welcome to cortex {user?.name ? user.name : ''}!</h1>
      {user?.name ? (
        <h1>Redirecting to your dashboard.</h1>
      ) : (
        <div>
          <p>This page is a work in progress, but you can still use our application!</p>
          <p>Click the user icon in the top right to register or login.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
