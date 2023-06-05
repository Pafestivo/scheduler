"use client";

import { getData, postData } from "@/utilities/serverRequests/serverRequests"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const HomePage = () => {
  const data = useSession()
  console.log('data', data)
  const [loggedUser, setLoggedUser] = useState(null)

  useEffect(() => {
    // fix unnecessary re-rendering
    const getUser = async () => {
      if (loggedUser) return;
      if(data.data?.user && data.status === 'authenticated') {
        const { email, name } = data.data?.user
        await postData('/auth/register', {email, name})
      }
      const user = await getData("/auth/me")
      setLoggedUser(user)
    }
    getUser()
  }, [data.data?.user, loggedUser, data.status])

  return (
    <div>
      {loggedUser ? (
        <p>user is logged in</p>
      ) : (
        <p>no user logged in</p>
      )}
  <h1>Home Page</h1>
    </div>
  )
}

export default HomePage