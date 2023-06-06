'use client';
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useGlobalContext } from '@/app/context/store';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertBar() {
  const { alert, setAlert, alertOpen, setAlertOpen } = useGlobalContext();
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setAlertOpen(false);
      return;
    } else {
      setAlertOpen(false);
    }
  };

  return (
    <>
      {alert && (
        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={alert?.severity ? alert.severity : 'info'} sx={{ width: '100%' }}>
            {alert?.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
