import * as React from 'react';
import Box from '@mui/material/Box';
import CalendarBar from './CalendarBar';

const data = [
  {
    id: 37,
    userHash: ['2610c0083667a579260dc5af6fc6e372f3d8c9a26b366706f171f7ef80a33538'],
    licenseHash: '',
    appointmentsHash: [],
    integrationId: null,
    isActive: true,
    type: 'free',
    name: 'testing booking',
    timestamp: '2023-06-07T06:01:47.236Z',
    padding: null,
    availabilityHash: [],
    hash: 'cd74ee010b3ab93be65a2ca1ddab3eb91bdc72779c5011667411f97ecd94cb43',
    deleted: false,
    personalForm: [
      {
        question: 'how did you hear about us?',
        inputType: 'text',
        required: true,
      },
      {
        question: 'what is your preferred way to communicate?',
        inputType: 'select',
        options: {
          whatsapp: 'whatsapp',
          sms: 'sms',
          calls: 'phone calls',
          emails: 'emails',
        },
        required: true,
      },
      {
        question: 'what kind of treatment do you need?',
        inputType: 'textarea',
        required: false,
      },
    ],
    appointmentsLength: 60,
  },
  {
    id: Math.floor(Math.random() * 100),
    userHash: ['random-string1'],
    licenseHash: 'random-string2',
    appointmentsHash: ['random-string3', 'random-string4'],
    integrationId: null,
    isActive: Math.random() < 0.5,
    type: 'paid',
    name: 'booking example',
    timestamp: '2023-06-07T12:34:56.789Z',
    padding: null,
    availabilityHash: ['random-string5', 'random-string6'],
    hash: 'random-string7',
    deleted: Math.random() < 0.5,
    personalForm: [
      {
        question: 'how did you hear about us?',
        inputType: 'text',
        required: Math.random() < 0.5,
      },
      {
        question: 'what is your preferred way to communicate?',
        inputType: 'select',
        options: {
          whatsapp: 'whatsapp',
          sms: 'sms',
          calls: 'phone calls',
          emails: 'emails',
        },
        required: Math.random() < 0.5,
      },
      {
        question: 'what kind of treatment do you need?',
        inputType: 'textarea',
        required: Math.random() < 0.5,
      },
    ],
    appointmentsLength: Math.floor(Math.random() * 120),
  },
  {
    id: Math.floor(Math.random() * 100),
    userHash: ['random-string8'],
    licenseHash: 'random-string9',
    appointmentsHash: ['random-string10', 'random-string11', 'random-string12'],
    integrationId: null,
    isActive: Math.random() < 0.5,
    type: 'free',
    name: 'sample booking',
    timestamp: '2023-06-07T18:09:23.456Z',
    padding: null,
    availabilityHash: ['random-string13'],
    hash: 'random-string14',
    deleted: Math.random() < 0.5,
    personalForm: [
      {
        question: 'how did you hear about us?',
        inputType: 'text',
        required: Math.random() < 0.5,
      },
      {
        question: 'what is your preferred way to communicate?',
        inputType: 'select',
        options: {
          whatsapp: 'whatsapp',
          sms: 'sms',
          calls: 'phone calls',
          emails: 'emails',
        },
        required: Math.random() < 0.5,
      },
      {
        question: 'what kind of treatment do you need?',
        inputType: 'textarea',
        required: Math.random() < 0.5,
      },
    ],
    appointmentsLength: Math.floor(Math.random() * 120),
  },
];

export default function CalendarStack() {
  return (
    <Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
      {data.map((calendar) => (
        <CalendarBar key={calendar.id} calendar={calendar} />
      ))}
    </Box>
  );
}
