"use client";

import { getData } from "@/utilities/serverRequests/serverRequests"
import { useEffect, useState } from "react"

const HomePage = () => {
  const [loggedUser, setLoggedUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const user = await getData("/auth/me")
      setLoggedUser(user)
    }
    getUser()
  }, [])

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