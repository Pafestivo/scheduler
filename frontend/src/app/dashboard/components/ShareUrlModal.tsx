'use client';
import * as React from 'react';
import {
  Tabs,
  Tab,
  Typography,
  Box,
  TextField,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
  TextareaAutosize,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ShareUrlModal({
  open,
  setOpen,
  url,
  hash,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  url: string;
  hash: string;
}) {
  const [value, setValue] = React.useState(0);
  const [iframe, setIframe] = React.useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    const generateIframeScript = () => {
      const iframe = `<iframe src="${url}/?noframe=true&skipHeaderFooter=true" id="crtxframe${hash}" style="width:100%;height:1000px;border:0px;background-color:transparent;" frameborder="0" allowtransparency="true"></iframe><script>window.addEventListener && window.addEventListener("message", function(event){if (event.origin === "${url}"){document.getElementById("crtxframe${hash}").style.height = event.data + "px";}}, false);</script>`;
      setIframe(iframe);
    };
    generateIframeScript();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogContent>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="URL" {...a11yProps(0)} />
                <Tab label="Button" {...a11yProps(1)} />
                <Tab label="Embed" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Box textAlign={'center'}>
                <Typography variant="h6" fontWeight={700}>
                  Your booking page URL
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  You can copy and paste this link to share your booking page with your customers.
                </Typography>
                <TextField inputProps={{ readOnly: true }} value={url} fullWidth onFocus={(e) => e.target.select()} />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => navigator.clipboard.writeText(url)}
                >
                  Copy URL To clipboard
                </Button>
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Box textAlign={'center'}>
                <Typography variant="h6" fontWeight={700}>
                  Your booking page URL
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  You can copy and paste this link to share your booking page with your customers.
                </Typography>
                <TextareaAutosize maxRows={10} readOnly value={iframe} onFocus={(e) => e.target.select()} />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => navigator.clipboard.writeText(url)}
                >
                  Copy Code
                </Button>
              </Box>
            </TabPanel>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
