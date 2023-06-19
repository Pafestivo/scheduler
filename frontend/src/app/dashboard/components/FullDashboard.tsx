'use client';
import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  CssBaseline,
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid,
  Paper,
  Link,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { secondaryListItems } from './listItems';
import UserMenu from '@/components/UserMenu';
import theme from '@/theme';
import DashBoardSettingsList from './DashBoardSettingsList';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import FeedIcon from '@mui/icons-material/Feed';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TodayIcon from '@mui/icons-material/Today';
import GeneralSettings from './GeneralSettings';
import AvailabilitySettings from './AvailabilitySettings';
import BookingSettings from './BookingSettings';
import NotificationSettings from './NotificationSettings';
import IntegrationSettings from './IntegrationSettings';
import { useParams, useRouter } from 'next/navigation';
import { getData } from '@/utilities/serverRequests/serverRequests';
import { useGlobalContext } from '@/app/context/store';
import Appointments from './Appointments';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Cortex
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.

export default function FullDashboard() {
  const params = useParams();
  const router = useRouter();
  const [hasAccess, setHasAccess] = React.useState(false);
  const { calendar, setCalendar, user, setLoading } = useGlobalContext();
  React.useEffect(() => {
    const getCalendar = async () => {
      const response = await getData(`/calendars/fullCalendar/${params.hash}`);
      setCalendar(response.data);
    };
    getCalendar();
  }, [params.hash, setCalendar]);
  React.useEffect(() => {
    setLoading(true);
    if (user && !user?.calendars.includes(params.hash)) {
      setLoading(false);
      router.push('/notfound');
    } else if (user && user?.calendars.includes(params.hash)) {
      setHasAccess(true);
      setLoading(false);
    }
  }, [params.hash, router, user, user?.calendars]);

  const SETTING_COMPONENTS = [
    {
      name: 'General',
      icon: <DashboardIcon />,
      component: <GeneralSettings />,
    },
    {
      name: 'Times & Availability',
      icon: <ScheduleIcon />,
      component: <AvailabilitySettings />,
    },
    {
      name: 'Booking form',
      icon: <FeedIcon />,
      component: <BookingSettings />,
    },
    {
      name: 'Notifications and event details',
      icon: <NotificationsActiveIcon />,
      component: <NotificationSettings />,
    },
    {
      name: 'Integrations',
      icon: <IntegrationInstructionsIcon />,
      component: <IntegrationSettings />,
    },
    {
      name: 'Appointments',
      icon: <TodayIcon />,
      component: <Appointments />,
    },
  ];

  const [open, setOpen] = React.useState(true);
  const [activeSetting, setActiveSetting] = React.useState<null | number>(null);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>
      {hasAccess && (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                Dashboard
              </Typography>
              <UserMenu />
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              <DashBoardSettingsList setActiveSetting={setActiveSetting} list={SETTING_COMPONENTS} />
              <Divider sx={{ my: 1 }} />
              {secondaryListItems}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {activeSetting !== null && calendar ? (
                      SETTING_COMPONENTS[activeSetting].component
                    ) : calendar ? (
                      <GeneralSettings />
                    ) : null}
                  </Paper>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}
