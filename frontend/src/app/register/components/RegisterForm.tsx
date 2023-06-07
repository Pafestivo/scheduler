'use client';
import { validateEmail } from '@/utilities/emailValidator';
import React from 'react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import AutoComplete from 'components/AutoComplete';
// import { COUNTRIES } from 'data/countries';
import { Avatar, Box, Button, Checkbox, Divider, Grid, Typography, FormControlLabel } from '@mui/material';
import FormInput from '@/components/FormInput';
import { REGISTER_FORM_DATA } from '@/utilities/constants';
import { signIn } from 'next-auth/react';
import { useGlobalContext } from '@/app/context/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { postData } from '@/utilities/serverRequests/serverRequests';

const SignUpForm = () => {
  const { alert, setAlert, setUser, user } = useGlobalContext();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const firstName = data.get('firstName') as string;
    const lastName = data.get('lastName') as string;
    const email = data.get('email') as string;
    const acceptPromotions = data.get('marketing') as string;
    const country = data.get('Country') as string;
    const password = data.get('password') as string;
    const password2 = data.get('password2') as string;
    const phone = data.get('phone') as string;
    const validMail = validateEmail(email);

    if (
      validMail &&
      password2 === password &&
      password.length >= 8 &&
      password2.length >= 8 &&
      firstName.length > 0 &&
      lastName.length > 0
    ) {
      const newUser = {
        name: `${firstName.trim()} ${lastName.trim()}`,
        password,
        email,
        phone,
        acceptPromotions: acceptPromotions ? true : false,
        // country,
      };
      try {
        await postData('/auth/register', newUser);
        router.push('/');
      } catch (error) {
        setAlert({
          message: 'Email already exists in our database',
          code: 3,
          severity: 'error',
        });
      }
    } else if (!firstName.length) {
      setAlert({
        message: 'Please enter a first name',
        code: 1,
        severity: 'error',
      });
    } else if (!lastName.length) {
      setAlert({
        message: 'Please enter a last name',
        code: 2,
        severity: 'error',
      });
    } else if (!validMail) {
      setAlert({
        message: 'Please enter a valid email',
        code: 3,
        severity: 'error',
      });
    } else if (password && password.length <= 8) {
      setAlert({
        message: 'Password too short enter atleast 8 characters',
        code: 4,
        severity: 'error',
      });
    } else if (password !== password2) {
      setAlert({
        message: 'Wrong password confirmation entered',
        code: 5,
        severity: 'error',
      });
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
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <PersonAddIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {alert ? alert.message : 'Sign up'}
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: '400px' }}>
        <Grid container spacing={2}>
          {REGISTER_FORM_DATA.map((field, idx) => (
            <Grid key={field.name} item xs={12} sm={idx < 2 ? 6 : 12}>
              <FormInput
                label={field.label}
                name={field.name}
                title={field.title}
                fieldIdx={idx + 1}
                type={field.type}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            {/* <AutoComplete label={'Country'} array={COUNTRIES} /> */}
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox value={true} color="primary" />}
              label="I want to receive inspiration, marketing promotions and updates via email."
              name="marketing"
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Register
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
          Register with Google
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href={'/login'}>
              <Typography color={'blue'}>Already have an account? Sign in</Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SignUpForm;
