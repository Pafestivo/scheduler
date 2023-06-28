'use client'
import { useEffect } from "react";
import { useGlobalContext } from "./context/store";

const HomePage = () => {
  const { user } = useGlobalContext()

  useEffect(() => {
    if (user?.hash) {
      console.log('user:',user)
      // window.location.href = '/dashboard'
    }
  }, [user])
  return (
    <div>
      <h1>Welcome to cortex!</h1>
      <p>This page is a work in progress, but you can still use our application!</p>
      <p>Click the user icon in the top right to register or login.</p>
    </div>
  );
};

export default HomePage;
