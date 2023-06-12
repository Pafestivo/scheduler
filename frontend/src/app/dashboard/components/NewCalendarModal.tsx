import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import AddPhoto from '@/components/AddPhoto';
import FormInput from '@/components/FormInput';
import { Box } from '@mui/material';
import { useGlobalContext } from '@/app/context/store';
import { getData, postData } from '@/utilities/serverRequests/serverRequests';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewCalendarModal({
  formOpen,
  setFormOpen,
  setCalendars,
}: {
  formOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCalendars: React.Dispatch<React.SetStateAction<never[] | any[]>>;
}) {
  const { user, setAlert, setAlertOpen, setLoading } = useGlobalContext();
  const [image, setImage] = React.useState<File | null>(null);

  const handleClose = () => {
    setFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return console.log('no user');
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name');
    try {
      setLoading(true);
      setFormOpen(false);
      await postData('/calendars', { name, userHash: user.hash, image });
      const response = await getData(`/calendars/${user.hash}`);
      setCalendars(response.data);
      setAlert({ message: `Calendar '${name}' created`, severity: 'success', code: 0 });
      setAlertOpen(true);
      setLoading(false);
    } catch (error) {
      setFormOpen(false);
      setAlert({ message: 'Something went wrong on our end, Please try again later.', severity: 'error', code: 0 });
      setAlertOpen(true);
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog
        open={formOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'New calendar settings'}</DialogTitle>
        <Box onSubmit={handleSubmit} component={'form'}>
          <DialogContent sx={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
            <AddPhoto />
            <FormInput fieldIdx={0} name="name" label="Calendar Name" title="Calendar Name" type="text" />
          </DialogContent>
          <DialogActions>
            <Button fullWidth type="submit">
              Create
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}