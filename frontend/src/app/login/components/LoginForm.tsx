'use client';
import React from 'react';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Avatar, Box, Button, Divider, Grid, Typography } from '@mui/material';
import FormInput from '@/components/FormInput';
import { LOGIN_FORM_DATA } from '@/utilities/constants';
import Link from 'next/link';
import { useGlobalContext } from '@/app/context/store';
import { useRouter } from 'next/navigation';
import { getData, postData } from '@/utilities/serverRequests/serverRequests';
import { signIn } from 'next-auth/react';
import { validateEmail } from '@/utilities/emailValidator';

const LoginForm = () => {
  const { alert, setAlert, setUser, user } = useGlobalContext();
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    if (validateEmail(email) === false) {
      setAlert({ message: 'Invalid email', code: 0, severity: 'error' });
      return;
    }
    if (!password.length) {
      setAlert({ message: 'Please enter a password!', code: 1, severity: 'error' });
      return;
    }

    try {
      const res = await postData('/auth/login', { email, password });
      if (res.success) {
        const response = await getData('/auth/me');
        if (response.success) {
          setUser(response.data);
        }
        router.push('/');
      } else {
        setAlert({ message: 'Wrong credentials', code: 1, severity: 'error' });
        return;
      }
    } catch (error: any) {
      setAlert({ message: 'Wrong credentials', code: 1, severity: 'error' });
    }
  };

  return (
    <Box
      sx={{
        marginTop: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: '#3f3faf' }}>
        <PersonOutlineIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {alert ? alert.message : 'Sign in'}
      </Typography>
      <Box component="form" maxWidth={'400px'} onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
        {LOGIN_FORM_DATA.map((field, idx) => (
          <FormInput
            label={field.label}
            name={field.name}
            title={field.title}
            fieldIdx={idx}
            key={field.name}
            type={field.type}
          />
        ))}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign In
        </Button>
        <Divider>OR</Divider>
        <Button
          onClick={() => {
            signIn('google');
          }}
          type="button"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In with Google
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="#">
              <Typography sx={{ color: 'blue' }}>Forgot password?</Typography>
            </Link>
          </Grid>
          <Grid item>
            <Link href={'/register'}>
              <Typography sx={{ color: 'blue' }}>{"Don't have an account? Sign Up"}</Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginForm;
