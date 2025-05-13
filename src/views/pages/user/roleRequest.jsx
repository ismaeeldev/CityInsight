import React, { useContext, useState, useEffect } from 'react';
import {
    Container, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, CircularProgress, Pagination
} from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import AccessDenied from '../../Error/AccessDenied.jsx';

const AllUser = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { adminRole } = useContext(MainContext);

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');

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

            const applications = data.applications || [];

            setUsers(applications);
            setTotalPages(Math.ceil(applications.length / 10)); // 
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
                alert(data.message);
                fetchUsers();
            } else {
                alert(data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
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
                                        <TableCell align="center">{user.name || ''}</TableCell>
                                        <TableCell align="center">{user.email}</TableCell>
                                        <TableCell align="center">{user.contact}</TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'inline-block',
                                                    px: 2,
                                                    py: 0.5,
                                                    borderRadius: 2,
                                                    fontWeight: 'bold',
                                                    color: user.verificationStatus === 'applied' ? 'black' : '#fff',
                                                    bgcolor:
                                                        user.verificationStatus === 'approved' ? 'success.main' :
                                                            user.verificationStatus === 'rejected' ? 'error.main' :
                                                                user.verificationStatus === 'applied' ? 'warning.main' :
                                                                    'grey.500',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {user.verificationStatus || 'N/A'}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            {new Date(user.createdAt).toLocaleDateString('en-GB')}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                onClick={() => handleStatusUpdate(user._id, 'accepted')}
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                style={{ marginRight: '8px', borderRadius: '8px' }}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                onClick={() => handleStatusUpdate(user._id, 'rejected')}
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                style={{ borderRadius: '8px' }}
                                            >
                                                Reject
                                            </Button>
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
        </Container>
    );
};

export default AllUser;
