import React, { useContext, useState, useEffect } from 'react';
import {
    Container, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, CircularProgress, Pagination, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, Modal, Grid, Typography, Divider,
} from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';


const AllUser = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { adminRole } = useContext(MainContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [userOrders, setUserOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [openHistoryModal, setHistoryModal] = useState(false)

    const permissionPerPage = 10;

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    // Use a useEffect for debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 2000);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    // Fetch users with search query
    useEffect(() => {
        if (debouncedSearchQuery) {
            searchUsers(debouncedSearchQuery);
        } else {
            fetchUsers(currentPage);
        }
    }, [debouncedSearchQuery, currentPage]);

    const fetchUsers = async (page) => {
        setLoading(true);

        const adminToken = getCookie("adminToken");

        try {
            const response = await fetch(`${BASE_URL}/admin/all-users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch users");
            }

            setUsers(data.users);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const searchUsers = async (query) => {
        setIsSearching(true);
        setLoading(true);

        const adminToken = getCookie("adminToken");

        try {
            const response = await fetch(`${BASE_URL}/admin/search-users?search=${query}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch users");
            }

            setUsers(data.users);
            setTotalPages(1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };


    if (adminRole?.toLowerCase() !== "admin") {
        return <AccessDenied />;
    }

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" my={4}>
                <Button variant="contained" color="error" onClick={() => navigate('/admin/dashboard')}>
                    Back to Dashboard
                </Button>

                <TextField
                    label="Search Users"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    size="small"
                    fullWidth
                    style={{ maxWidth: 200 }}
                />
            </Box>

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
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">No</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Name</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Email</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Role</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Created</TableCell>

                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow key={user._id}>
                                        <TableCell align="center">
                                            {(currentPage - 1) * permissionPerPage + index + 1}
                                        </TableCell>
                                        <TableCell align="center">{user.name}</TableCell>
                                        <TableCell align="center">{user.email}</TableCell>
                                        <TableCell align="center">{user.role || 'N/A'}</TableCell>
                                        <TableCell align="center">
                                            {new Date(user.createdAt).toLocaleDateString('en-GB')}
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


            <Modal open={openHistoryModal} onClose={() => setHistoryModal(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 600,
                        bgcolor: 'background.paper',
                        boxShadow: 6,
                        p: 4,
                        borderRadius: 3,
                        overflow: 'hidden', // Hide the scroll bar on the modal itself
                    }}
                >
                    <Grid container spacing={3}>
                        {/* Modal Header */}
                        <Grid item xs={12} textAlign="center">
                            <Typography variant="h4" fontWeight="bold">
                                User Order History
                            </Typography>
                        </Grid>

                        {/* Close Button in the top-right corner */}
                        <Grid item xs={12} textAlign="right">
                            <IconButton
                                onClick={() => setHistoryModal(false)}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Grid>

                        {/* Order Info Section with Scrollable Content */}
                        <Grid item xs={12} sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {isLoadingOrders ? (
                                <Typography textAlign="center" color="text.secondary">
                                    Loading orders...
                                </Typography>
                            ) : userOrders.length > 0 ? (
                                userOrders.map((order) => (
                                    <Paper key={order._id} elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                                        <Grid container justifyContent="space-between" alignItems="center">
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body1" fontWeight={600}>
                                                    Order #{order._id?.slice(-6).toUpperCase()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Payment: {order.paymentStatus}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} sm={6} textAlign="right">
                                                <Typography variant="body2" fontWeight={500}>
                                                    ${order.totalAmount?.toFixed(2)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(order.createdAt).toLocaleDateString('en-GB')}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                ))
                            ) : (
                                <Typography textAlign="center" color="text.secondary">
                                    No order history found.
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Modal>



        </Container>
    );
};

export default AllUser;
