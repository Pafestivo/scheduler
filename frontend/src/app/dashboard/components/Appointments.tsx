/* eslint-disable @typescript-eslint/no-explicit-any */
import { getData, putData } from '@/utilities/serverRequests/serverRequests';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
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
  Box,
} from '@mui/material';
import { useGlobalContext } from '@/app/context/store';

const Appointments = () => {
  const [appointments, setAppointments] = useState<never[] | Appointment[]>([]);
  const [perPage, setPerPage] = useState<number>(10); // Number of items per page
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page number
  const [sorting, setSorting] = useState<string>('upcoming'); // Sorting option
  const [selectedStatus, setSelectedStatus] = useState<string>('All'); // Selected status for filtering
  const { setLoading, setAlert, setAlertOpen } = useGlobalContext()
  const params = useParams();
  const calendarHash = params.hash

  const getAppointments = useCallback(async () => {
    const response = await getData(`/appointments/${params.hash}`);
    setAppointments(response.data);
  }, [params.hash]);

  useEffect(() => {
    getAppointments();
  }, [params.hash, getAppointments]);

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

  // Handle number of records per page
  const handlePerPageChange = (event: any) => {
    const perPageValue = event.target.value as number;
    setPerPage(perPageValue);
    setCurrentPage(1);
  };

  // Apply pagination, sorting, and status filtering to the data
  const startIndex: number = (currentPage - 1) * perPage;
  const endIndex: number = startIndex + perPage;
  const filteredAppointments: Appointment[] = !selectedStatus || selectedStatus === 'All'
    ? appointments
    : appointments.filter((appointment) => appointment.status === selectedStatus);
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
  const handleCancelAppointment = async (appointmentHash: string) => {
    setLoading(true)
    const cancelAppointment = await putData('/appointments', {
      hash: appointmentHash,
      status: "canceled"
    })
    if(cancelAppointment.success) {
      setAlert({
        message: 'Appointment canceled successfully',
        severity: 'success',
        code: 0,
      });
      getAppointments()
    } else {
      setAlert({
        message: 'Failed to cancel appointment, please try again later',
        severity: 'error',
        code: 0,
      });
    }
    setAlertOpen(true);
    setLoading(false);
  };

  // Function to handle rescheduling an appointment
  const handleRescheduleAppointment = (appointmentHash: string) => {
    const url = `/book/${calendarHash}/${appointmentHash}`;

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.click();
  };

  // Function to handle approving an appointment
  const handleApproveAppointment = async (appointmentHash: string) => {
    setLoading(true)
    const cancelAppointment = await putData('/appointments', {
      hash: appointmentHash,
      status: "confirmed"
    })
    if(cancelAppointment.success) {
      setAlert({
        message: 'Appointment confirmed successfully',
        severity: 'success',
        code: 0,
      });
      getAppointments()
    } else {
      setAlert({
        message: 'Failed to confirm appointment, please try again later',
        severity: 'error',
        code: 0,
      });
    }
    setAlertOpen(true);
    setLoading(false);
  };

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Box sx={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
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
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
            <MenuItem value="rescheduled">Rescheduled</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Per Page</InputLabel>
          <Select value={perPage} onChange={handlePerPageChange}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </FormControl>
      </Box>


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
              <TableRow key={appointment.hash} sx={appointment.status === 'canceled' ? { textDecoration: 'line-through' } : {}}>
                <TableCell>{dayjs(appointment.date).format('YYYY-MM-DD')}</TableCell>
                <TableCell>{appointment.startTime}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                {appointment.status === 'canceled' ? (
                  <TableCell>
                    <p>No actions for canceled appointments</p>
                  </TableCell>
                ) : (
                <TableCell>
                  <Button onClick={() => handleCancelAppointment(appointment.hash)}>Cancel</Button>
                  <Button onClick={() => handleRescheduleAppointment(appointment.hash)}>Reschedule</Button>
                  {appointment.status !== 'confirmed' && <Button onClick={() => handleApproveAppointment(appointment.hash)}>Approve</Button>}
                </TableCell>
                )}
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
