"use client";

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { postData } from "@/utilities/serverRequests/serverRequests";
import { signIn } from 'next-auth/react'

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptPromotions, setAcceptPromotions] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!email || !password) {
      setErrorMsg("Please fill all the fields");
      return;
    }
    if(password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    const details = {
      name,
      email,
      phone,
      password,
      acceptPromotions,
    };

    try {
      const response = await postData("/auth/register", details);
      console.log(response);
      setErrorMsg("");
      router.push("/");
    } catch (error:any) {
      console.error(error)
      if(error.response.status === 409) {
        setErrorMsg("Email already exists");
      }
    }
  }


  return (
    <div>
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name*:
          <input required type="name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email*:
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password*:
          <input required type="password" value={password} minLength={6} maxLength={20} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Confirm Password*:
          <input required type="password" value={confirmPassword} minLength={6} maxLength={20} onChange={(e) => setConfirmPassword(e.target.value)} />
        </label>
        <label>
          Phone:
          <input type="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label>
          Accept Promotions?
          <input type="checkbox" checked={acceptPromotions} onChange={(e) => setAcceptPromotions(e.target.checked)} />
        </label>
        <p style={{color: "red", fontSize: "14px"}}>{errorMsg}</p>
        <button type="submit">Register now</button>
      </form>

      <p>Or register with:</p>
      <button onClick={() => signIn('google')}>Google</button>
    </div>
  )
}

export default RegisterForm;