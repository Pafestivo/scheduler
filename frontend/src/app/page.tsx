'use client'
import { useGlobalContext } from "./context/store";

const HomePage = () => {
  const { user } = useGlobalContext()
  return (
    <div>
      <h1>Welcome to cortex {user?.name ? user.name : ''}!</h1>
      <p>This page is a work in progress, but you can still use our application!</p>
      <p>Click the user icon in the top right to register or login.</p>
    </div>
  );
};

export default HomePage;
