import { useGlobalContext } from '@/app/context/store';
import { getData } from '@/utilities/serverRequests/serverRequests';
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

const settings = [
  // { name: 'Profile', href: '/profile' },
  { name: 'Dashboard', href: '/dashboard' },
  // { name: 'Settings', href: '/settings' },
  { name: 'Logout', href: '#' },
];
const noUser = [
  { name: 'Login', href: '/login' },
  { name: 'Register', href: '/register' },
];

const UserMenu = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { user, setUser } = useGlobalContext();
  const sessionData = useSession();

  const handleLogout = async () => {
    handleCloseUserMenu();
    try {
      console.log('logging out')
      setUser(null);
      await getData('/auth/logout');
      signOut();
    } catch (error) {
      console.log(error);
    }
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
        <Tooltip title="Open settings">
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
                <MenuItem key={setting.name} onClick={setting.name !== 'Logout' ? handleCloseUserMenu : handleLogout}>
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
