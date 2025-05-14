import React, { useContext, useState, useEffect } from 'react';
import {
    Container, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, CircularProgress, Pagination, Stack
} from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import AccessDenied from '../../Error/AccessDenied.jsx';
import Swal from 'sweetalert2'

const AllUser = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { adminRole } = useContext(MainContext);

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const [modalImage, setModalImage] = useState(null);



    const permissionPerPage = 10;

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const adminToken = getCookie("adminToken");

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/users/publisher-requests?page=${currentPage}`, {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch users");

            const applications = Array.isArray(data.applications) ? data.applications : [];

            const pendingApplications = applications.filter(
                app => app.user?.verificationStatus?.toLowerCase() === "applied"
            );

            setUsers(pendingApplications);
            setTotalPages(Math.ceil(pendingApplications.length / 10));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (_, value) => setCurrentPage(value);

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await fetch(`${BASE_URL}/users/update-request/${id}?status=${status}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                fetchUsers();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: data.message || 'Failed to update status',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getTextColor = (status) => {
        switch (status) {
            case 'approved':
                return 'text.primary';  // Use dark text on light backgrounds (success.green)
            case 'rejected':
                return 'text.primary';  // Use dark text on light backgrounds (error.red)
            case 'applied':
                return 'text.primary';  // Use dark text on light backgrounds (warning.yellow)
            default:
                return 'text.primary';  // Default dark text
        }
    };


    if (adminRole?.toLowerCase() !== "admin") return <AccessDenied />;

    return (
        <Container>
            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Box textAlign="center" color="red">{error}</Box>
            ) : users.length === 0 ? (
                <Box textAlign="center" my={4}>No users found.</Box>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"><strong>No</strong></TableCell>
                                    <TableCell align="center"><strong>Name</strong></TableCell>
                                    <TableCell align="center"><strong>Email</strong></TableCell>
                                    <TableCell align="center"><strong>Contact</strong></TableCell>
                                    <TableCell align="center"><strong>Photo</strong></TableCell>
                                    <TableCell align="center"><strong>CNIC</strong></TableCell>
                                    <TableCell align="center"><strong>Status</strong></TableCell>
                                    <TableCell align="center"><strong>Created</strong></TableCell>
                                    <TableCell align="center"><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow key={user._id}>
                                        <TableCell align="center">
                                            {(currentPage - 1) * permissionPerPage + index + 1}
                                        </TableCell>
                                        <TableCell align="center">{user.user?.name || ''}</TableCell>
                                        <TableCell align="center">{user.user?.email}</TableCell>
                                        <TableCell align="center">{user.user?.contact}</TableCell>
                                        <TableCell align="center">
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                <span
                                                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                                    onClick={() => setModalImage(user.facePhoto)}
                                                >
                                                    View
                                                </span>

                                            </div>
                                        </TableCell>
                                        <TableCell align="center">
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                <span
                                                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                                    onClick={() => setModalImage(user.cnicFront)}
                                                >
                                                    Front
                                                </span>
                                                <span
                                                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                                    onClick={() => setModalImage(user.cnicBack)}
                                                >
                                                    Back
                                                </span>
                                            </div>
                                        </TableCell>


                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'inline-block',
                                                    px: 2,
                                                    py: 0.5,
                                                    borderRadius: 2,
                                                    fontWeight: 'bold',
                                                    color: getTextColor(user.user?.verificationStatus),  // Dynamically set text color
                                                    bgcolor:
                                                        user.user?.verificationStatus === 'approved' ? 'success.main' :
                                                            user.user?.verificationStatus === 'rejected' ? 'error.main' :
                                                                user.user?.verificationStatus === 'applied' ? 'warning.main' :
                                                                    'grey.500',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {user.user?.verificationStatus || 'N/A'}
                                            </Box>
                                        </TableCell>

                                        <TableCell align="center">
                                            {new Date(user.user?.createdAt).toLocaleDateString('en-GB')}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack
                                                direction={{ xs: 'column', sm: 'row' }} // Stack on xs, row on sm+
                                                spacing={1}
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Button
                                                    onClick={() => handleStatusUpdate(user.user?._id, 'accepted')}
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    sx={{ borderRadius: '8px', width: { xs: '100%', sm: 'auto' } }}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    onClick={() => handleStatusUpdate(user.user?._id, 'rejected')}
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    sx={{ borderRadius: '8px', width: { xs: '100%', sm: 'auto' } }}
                                                >
                                                    Reject
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            )}


            {modalImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                            maxWidth: '90%',
                            maxHeight: '90%',
                            overflow: 'auto',
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setModalImage(null)}
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                        >
                            ×
                        </button>

                        {/* Image */}
                        <img
                            src={modalImage}
                            alt="CNIC"
                            style={{
                                maxWidth: '500px',
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                margin: '0 auto',
                                borderRadius: '8px',
                            }}
                        />
                    </div>
                </div>
            )}

        </Container>
    );
};

export default AllUser;
