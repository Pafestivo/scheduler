import { useGlobalContext } from '@/app/context/store';
import { getData } from '@/utilities/serverRequests/serverRequests';
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

interface EnglishFallbackType {
  [key: string]: string;
}

const UserMenu = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { user, setUser, translations } = useGlobalContext();
  const sessionData = useSession();

  const englishFallback: EnglishFallbackType = {
    'openSettings': 'Open settings',
    'dashboard': 'Dashboard',
    'logout': 'Logout',
    'login': 'Login',
    'register': 'Register',
  };
  
  // Helper function to get the translation
  const t = (key: string): string => translations?.[key] || englishFallback[key] || key;

  const settings = [
    { name: t('dashboard'), href: '/dashboard' },
    { name: t('logout'), href: '#' },
  ];
  
  const noUser = [
    { name: t('login'), href: '/login' },
    { name: t('register'), href: '/register' },
  ];

  const handleLogout = async () => {
    handleCloseUserMenu();
    console.log('logging out');
    setUser(null);
    await getData('/auth/logout');
    signOut();
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title={t('openSettings')}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt={user ? user.name : undefined} src={sessionData.data?.user?.image || user?.pfp || undefined} />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {!user &&
            noUser.map((setting) => (
              <Link key={setting.name} href={setting.href} title={setting.name}>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              </Link>
            ))}
          {user &&
            settings.map((setting) => (
              <Link key={setting.name} href={setting.href} title={setting.name}>
                <MenuItem 
                onClick={setting.name == 'Logout' || setting.name == 'התנתק' ? handleLogout: handleCloseUserMenu}>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              </Link>
            ))}
        </Menu>
      </Box>
    </>
  );
};

export default UserMenu;
