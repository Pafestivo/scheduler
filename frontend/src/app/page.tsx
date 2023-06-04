"use client";

import { getData, postData } from "@/utilities/serverRequests/serverRequests"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const HomePage = () => {
  const data = useSession()
  console.log('data', data)
  const [loggedUser, setLoggedUser] = useState(null)

  // fix infinite loop
  useEffect(() => {
    const getUser = async () => {
      const user = await getData("/auth/me")
      setLoggedUser(user)
    }
    if(data.data?.user && !loggedUser) {
      const { email, name } = data.data?.user
      postData('/auth/register', {email, name})
    }
    getUser()
  }, [data.data?.user, loggedUser])

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