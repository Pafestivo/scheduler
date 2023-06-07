'use client';
import * as React from 'react';
import { AppBar, Box, Button, Container, IconButton, Menu, Toolbar, Typography } from '@mui/material';

import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useSession } from 'next-auth/react';
import { getData, postData } from '@/utilities/serverRequests/serverRequests';
import { useGlobalContext } from '@/app/context/store';
import theme from '@/theme';
import { ThemeProvider } from '@mui/material/styles';
import UserMenu from './UserMenu';

const pages = ['HOME', 'Pricing', 'Blog'];

const WEBSITE_NAME = 'Cortex';

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const { user, setUser } = useGlobalContext();
  const sessionData = useSession();

  React.useEffect(() => {
    // fix unnecessary re-rendering
    const getUser = async () => {
      if (user) return; // Break infinite loop by checking if a user is already logged in
      const userResponse = await getData('/auth/me');
      if (userResponse.data.hash) {
        setUser(userResponse.data);
      }
    };

    const registerUser = async () => {
      if (sessionData.data?.user && !user) {
        const { email, name } = sessionData.data.user;
        const response = await postData('/auth/register', { email, name });
        if (response.message === 'User already exists') {
          await postData('/auth/login', { email, name, provider: true });
        }
      }
      getUser(); // Call getUser after registering the user
    };

    const initialize = async () => {
      await registerUser(); // Register the user and call getUser after registration
    };

    initialize();
  }, [sessionData.data?.user, user, setUser]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      {!user && (
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
