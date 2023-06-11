import React from 'react';
import { Box, IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ShareUrlModal from './ShareUrlModal';

const ActionBox = ({ url, hash }: { url: string; hash: string }) => {
  const [open, setOpen] = React.useState(false);
  const handleShareClick = () => {
    setOpen(true);
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifySelf: 'flex-end' }}>
      <IconButton title="Share Booking Page" onClick={handleShareClick}>
        <ShareIcon />
      </IconButton>
      <ShareUrlModal open={open} setOpen={setOpen} url={url} hash={hash} />
    </Box>
  );
};

export default ActionBox;
