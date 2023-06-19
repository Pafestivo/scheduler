import { getData } from '@/utilities/serverRequests/serverRequests';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Appointment } from '@prisma/client';
import dayjs from 'dayjs';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';

const Appointments = () => {
  const [appointments, setAppointments] = useState<never[] | Appointment[]>([]);
  const [perPage, setPerPage] = useState<number>(10); // Number of items per page
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  const [sorting, setSorting] = useState<string>('upcoming'); // Sorting option
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // Selected status for filtering
  const params = useParams();

  useEffect(() => {
    const getAppointments = async () => {
      const response = await getData(`/appointments/${params.hash}`);
      setAppointments(response.data);
      console.log(response.data);
    };
    getAppointments();
  }, [params.hash]);

  // Handle pagination
  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sorting
  const handleSorting = (option: string) => {
    setSorting(option);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
  };

  // Apply pagination, sorting, and status filtering to the data
  const startIndex: number = (currentPage - 1) * perPage;
  const endIndex: number = startIndex + perPage;
  const filteredAppointments: Appointment[] = selectedStatus
    ? appointments.filter((appointment) => appointment.status === selectedStatus)
    : appointments;
  let sortedAppointments: Appointment[] = [];

  if (sorting === 'upcoming') {
    sortedAppointments = [...filteredAppointments].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  } else if (sorting === 'past') {
    sortedAppointments = [...filteredAppointments].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  const paginatedAppointments: Appointment[] = sortedAppointments.slice(startIndex, endIndex);

  // Function to handle canceling an appointment
  const handleCancelAppointment = (appointmentHash: string) => {
    // Implement the cancel appointment logic here
    console.log(`Cancel appointment: ${appointmentHash}`);
  };

  // Function to handle rescheduling an appointment
  const handleRescheduleAppointment = (appointmentHash: string) => {
    // Implement the reschedule appointment logic here
    console.log(`Reschedule appointment: ${appointmentHash}`);
  };

  // Function to handle approving an appointment
  const handleApproveAppointment = (appointmentHash: string) => {
    // Implement the approve appointment logic here
    console.log(`Approve appointment: ${appointmentHash}`);
  };

  return (
    <div>
      <FormControl>
        <InputLabel>Sort By</InputLabel>
        <Select value={sorting} onChange={(e) => handleSorting(e.target.value as string)}>
          <MenuItem value="upcoming">Upcoming</MenuItem>
          <MenuItem value="past">Past</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Status</InputLabel>
        <Select value={selectedStatus} onChange={(e) => handleStatusFilter(e.target.value as string)}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="canceled">Canceled</MenuItem>
          <MenuItem value="rescheduled">Rescheduled</MenuItem>
          <MenuItem value="confirmed">Confirmed</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAppointments.map((appointment) => (
              <TableRow key={appointment.hash}>
                <TableCell>{dayjs(appointment.date).format('YYYY-MM-DD')}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleCancelAppointment(appointment.hash)}>Cancel</Button>
                  <Button onClick={() => handleRescheduleAppointment(appointment.hash)}>Reschedule</Button>
                  <Button onClick={() => handleApproveAppointment(appointment.hash)}>Approve</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        {appointments.length > perPage && (
          <div>
            <Button onClick={() => handlePagination(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button
              onClick={() => handlePagination(currentPage + 1)}
              disabled={currentPage * perPage >= appointments.length}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
