import React from 'react';
import { Box } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddIcon from '@mui/icons-material/Add';

const AddPhoto = () => {
  //add image upload logic and recieve file state from parent who renders it to make the component generic...
  return (
    <>
      <Box
        component={'div'}
        sx={{
          height: '75px',
          width: '75px',
          borderRadius: '50px',
          border: '2px solid grey',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'lightgrey',
          p: 3,
        }}
      >
        <AddPhotoAlternateIcon
          sx={{
            fontSize: '2rem',
            color: 'pearl',
            ':hover': { fontSize: '3rem' },
            transition: 'all 0.3s ease-in-out',
            cursor: 'pointer',
          }}
        />
      </Box>
    </>
  );
};

export default AddPhoto;
