"use client"
import * as React from 'react';
import { AppBar, Box, Button, Container, IconButton, Menu, Toolbar, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useCallback } from 'react';
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

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const { user, setUser, translations } = useGlobalContext();
  const pathname = usePathname();
  const sessionData: { data: Isession | null } = useSession();

  const t = (key: string): string => translations?.[key] || key;

  const pages = [t('home'), t('pricing')];

  const getUser = useCallback(async () => {
    if (user) return;
    const userResponse = await getData('/auth/me');
    if (userResponse.data.hash) {
      setUser(userResponse.data);
    } else {
      setUser(undefined);
    }
  }, [setUser, user]);

  const registerUser = useCallback(async () => {
    if (sessionData.data?.user && !user) {
      console.log('sessionData', sessionData);
      const { email, name } = sessionData.data.user;
      const { provider } = sessionData.data;
      if(provider) {
        const { accessToken, refreshToken, expires, user,  } = sessionData.data
        try{
          await postData('/integration', {
            token: accessToken?.encrypted,
            refreshToken: refreshToken?.encrypted,
            expiresAt: expires,
            userEmail: user.email,
            provider,
            aTiv: accessToken?.iv,
            rTiv: refreshToken?.iv,
          });
        } catch(err) {
          console.error(err)
        }
      }
      const response = await postData('/auth/register', { email, name, provider });
      if (response.message === 'User already exists') {
        await postData('/auth/login', { email, provider });
        // await getData('/auth/me');
      }
    }
    await getUser();
  }, [getUser, sessionData, user]);

  useEffect(() => {
    registerUser();
  }, [registerUser]);

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
                  {t('websiteName')}
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
                    sx={{ display: { xs: 'block', md: 'none' } }}
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
                  {t('websiteName')}
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
};

export default Navbar;
