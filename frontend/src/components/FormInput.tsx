'use client';
import { useGlobalContext } from '@/app/context/store';
import { TextField } from '@mui/material';
import React, { useEffect } from 'react';

const FormInput = ({
  name,
  label,
  title,
  type,
  fieldIdx,
  setState
}: {
  name: string;
  label: string;
  title: string;
  type: string;
  fieldIdx: number;
  setState?: React.Dispatch<React.SetStateAction<{ [key:string]:string }>>;
}) => {
  const { alert, setAlert } = useGlobalContext();

  useEffect(() => {
    setAlert(null);
  }, [setAlert]);
  return (
    <TextField
      autoFocus
      type={type}
      name={name}
      fullWidth
      label={label}
      title={title}
      sx={{ backgroundColor: alert?.code === fieldIdx ? 'rgba(245, 132, 132, 0.44)' : null }}
      margin="normal"
      onFocus={() => {
        setAlert(null);
      }}
      onChange={(e) => {
        if(!setState) return;
        setState((prev) => ({
          ...prev,
          [name]: e.target.value
        }));
      }}
    ></TextField>
  );
};

export default FormInput;
