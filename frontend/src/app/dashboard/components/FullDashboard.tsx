"use client";
import * as React from "react";
import { styled, ThemeProvider } from "@mui/material/styles";
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
  Button,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { secondaryListItems } from "./listItems";
import UserMenu from "@/components/UserMenu";
import theme from "@/theme";
import DashBoardSettingsList from "./DashBoardSettingsList";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScheduleIcon from "@mui/icons-material/Schedule";
import FeedIcon from "@mui/icons-material/Feed";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import TodayIcon from "@mui/icons-material/Today";
import GeneralSettings from "./GeneralSettings";
import AvailabilitySettings from "./AvailabilitySettings";
import BookingSettings from "./BookingSettings";
import NotificationSettings from "./NotificationSettings";
import IntegrationSettings from "./IntegrationSettings";
import { useParams, useRouter } from "next/navigation";
import { getData } from "@/utilities/serverRequests/serverRequests";
import { useGlobalContext } from "@/app/context/store";
import Appointments from "./Appointments";
import ShareCalendar from "./ShareCalendar";
import { useTranslation } from "@/utilities/translations/useTranslation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Cortex
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const { calendar, setCalendar, user, setLoading } = useGlobalContext();
  const { t } = useTranslation();

  React.useEffect(() => {
    const getCalendar = async () => {
      const response = await getData(`/calendars/fullCalendar/${params.hash}`);
      setCalendar(response.data);
    };
    getCalendar();
  }, [params.hash, setCalendar]);
  React.useEffect(() => {
    setLoading(true);
    if (
      user &&
      user.calendars &&
      params.hash &&
      !user.calendars.includes(params.hash)
    ) {
      setLoading(false);
      router.push("/notfound");
      return;
    }
    if (
      user &&
      user.calendars &&
      params.hash &&
      user?.calendars.includes(params.hash)
    ) {
      setHasAccess(true);
      setLoading(false);
      return;
    }
    if (user && params.hash && !user.calendars) {
      setLoading(false);
      router.push("/notfound");
      return;
    }
    if (user === undefined) {
      setLoading(false);
      router.push("/notfound");
      return;
    }
  }, [params.hash, router, setLoading, user, user?.calendars]);

  const SETTING_COMPONENTS = [
    {
      name: t("General"),
      icon: <DashboardIcon />,
      component: (
        <GeneralSettings setHasUnsavedChanges={setHasUnsavedChanges} />
      ),
    },
    {
      name: t("Times & Availability"),
      icon: <ScheduleIcon />,
      component: (
        <AvailabilitySettings
          hasUnsavedChanges={hasUnsavedChanges}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />
      ),
    },
    {
      name: t("Booking form"),
      icon: <FeedIcon />,
      component: (
        <BookingSettings
          hasUnsavedChanges={hasUnsavedChanges}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />
      ),
    },
    {
      name: t("Notifications and event details"),
      icon: <NotificationsActiveIcon />,
      component: <NotificationSettings />,
    },
    {
      name: t("Integrations"),
      icon: <IntegrationInstructionsIcon />,
      component: <IntegrationSettings />,
    },
    {
      name: t("Appointments"),
      icon: <TodayIcon />,
      component: <Appointments />,
    },
    {
      name: t("Booking URL"),
      icon: <ShareIcon />,
      component: <ShareCalendar />,
    },
  ];

  const [open, setOpen] = React.useState(true);
  const [activeSetting, setActiveSetting] = React.useState<number>(0);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const moveToNextTab = () => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          t("You have unsaved changes. Are you sure you want to discard them?")
        )
      ) {
        // If the user confirms, proceed with the navigation.
        setActiveSetting(activeSetting + 1);
        setHasUnsavedChanges(false);
      }
    } else {
      // If there are no unsaved changes, proceed with the navigation.
      setActiveSetting(activeSetting + 1);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {hasAccess && (
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                onClick={() => router.push("/dashboard")}
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1, cursor: "pointer" }}
              >
                {t("Dashboard")}
              </Typography>
              <UserMenu />
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              <DashBoardSettingsList
                hasUnsavedChanges={hasUnsavedChanges}
                setHasUnsavedChanges={setHasUnsavedChanges}
                setActiveSetting={setActiveSetting}
                activeSetting={activeSetting}
                list={SETTING_COMPONENTS}
              />
              <Divider sx={{ my: 1 }} />
              {secondaryListItems}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {activeSetting !== null && calendar ? (
                      SETTING_COMPONENTS[activeSetting].component
                    ) : calendar?.hash === params.hash ? (
                      <GeneralSettings
                        setHasUnsavedChanges={setHasUnsavedChanges}
                      />
                    ) : null}
                    {activeSetting === SETTING_COMPONENTS.length - 1 ? null : (
                      <Button
                        onClick={moveToNextTab}
                        sx={{
                          width: "100px",
                          marginLeft: "auto",
                          fontSize: "16px",
                        }}
                      >
                        {t("Next")}
                      </Button>
                    )}
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
