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
  defaultValue,
  setState,
  noFocus,
}: {
  name: string;
  label: string;
  title: string;
  type: string;
  fieldIdx: number;
  defaultValue?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState?: (...args: any) => void;
  noFocus?: boolean;
}) => {
  const { alert, setAlert } = useGlobalContext();

  useEffect(() => {
    setAlert(null);
  }, [setAlert]);
  return (
    <TextField
      autoFocus={!noFocus ? true : false}
      type={type}
      name={name}
      fullWidth
      defaultValue={defaultValue}
      label={label}
      title={title}
      sx={{ backgroundColor: alert?.code === fieldIdx ? 'rgba(245, 132, 132, 0.44)' : null }}
      margin="normal"
      onFocus={() => {
        setAlert(null);
      }}
      onChange={(e) => {
        if (!setState) return;
        const secondArg = name ? name : fieldIdx;
        setState(e.target.value, secondArg);
      }}
    ></TextField>
  );
};

export default FormInput;
