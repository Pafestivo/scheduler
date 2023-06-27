'use client';
import * as React from 'react';
import { AppBar, Box, Button, Container, IconButton, Menu, Toolbar, Typography } from '@mui/material';

import MenuItem from '@mui/material/MenuItem';
import { useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useSession } from 'next-auth/react';
import { getData, postData } from '@/utilities/serverRequests/serverRequests';
import { useGlobalContext } from '@/app/context/store';
import theme from '@/theme';
import { ThemeProvider } from '@mui/material/styles';
import UserMenu from './UserMenu';
import { usePathname } from 'next/navigation';
import { Isession } from '@/utilities/types';

const pages = ['HOME', 'Pricing'];

const WEBSITE_NAME = 'Cortex';

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const { user, setUser } = useGlobalContext();
  const pathname = usePathname();
  const sessionData: { data: Isession | null } = useSession();

  useEffect(() => {
    console.log('sessionData', sessionData);
    // fix unnecessary re-rendering
    const getUser = async () => {
      if (user) return; // Break infinite loop by checking if a user is already logged in
      const userResponse = await getData('/auth/me');
      if (userResponse.data.hash) {
        console.log(userResponse.data);
        setUser(userResponse.data);
      } else {
        setUser(undefined);
      }
    };

    const registerUser = async () => {
      if (sessionData.data?.user && user === undefined) {
        const { email, name } = sessionData.data.user;
        const { provider } = sessionData.data;
        const response = await postData('/auth/register', { email, name, provider });
        if (response.message === 'User already exists') {
          await postData('/auth/login', { email, provider });
          await getData('/auth/me');
        }
      }
      getUser(); // Call getUser after registering the user
    };

    if (sessionData.data?.accessToken && user?.hash) {
      const reqBody = {
        token: sessionData.data.accessToken.encrypted,
        aTiv: sessionData.data.accessToken.iv,
        refreshToken: sessionData.data.refreshToken?.encrypted,
        rTiv: sessionData.data.refreshToken?.iv,
        userHash: user.hash,
        expiresAt: sessionData.data.expires,
        provider: 'google',
        userEmail: sessionData.data.user?.email,
      };
      console.log('sessionData', sessionData);
      console.log('reqBody', reqBody);
      postData('/integration', reqBody);
    }

    const initialize = async () => {
      await registerUser(); // Register the user and call getUser after registration
    };

    initialize();
  }, [sessionData.data?.user, user, setUser, sessionData]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      {pathname === '/' && (
        <ThemeProvider theme={theme}>
          <AppBar position="static">
            <Container maxWidth="xl">
              <Toolbar disableGutters>
                <CalendarMonthIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  {WEBSITE_NAME}
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: 'block', md: 'none' },
                    }}
                  >
                    {pages.map((page) => (
                      <MenuItem key={page} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{page}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
                <CalendarMonthIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                <Typography
                  variant="h5"
                  noWrap
                  component="a"
                  href=""
                  sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  {WEBSITE_NAME}
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  {pages.map((page) => (
                    <Button key={page} onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                      {page}
                    </Button>
                  ))}
                </Box>
                <UserMenu />
              </Toolbar>
            </Container>
          </AppBar>
        </ThemeProvider>
      )}
    </>
  );
}
export default Navbar;
