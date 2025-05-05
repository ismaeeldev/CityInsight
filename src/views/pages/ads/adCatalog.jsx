import React, { useContext, useState, useEffect } from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Button, CircularProgress } from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx';
import Swal from 'sweetalert2';

const AdsCatalog = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [ads, setAds] = useState([]
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const { adminRole, adminName } = useContext(MainContext);
    const navigate = useNavigate();

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const adminToken = getCookie("adminToken");

    const fetchAds = async () => {
        setLoading(true);
        try {
            const status = statusFilter === 'All' ? '' : statusFilter;
            const response = await fetch(`${BASE_URL}/add/get-all?status=${status}&skip=${(currentPage - 1) * 10}&limit=10`);
            const data = await response.json();

            if (data) {
                setAds(data);
                setTotalPages(Math.ceil(data.length / 10));
            }
        } catch (error) {
            console.error('Error fetching ads:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAds();
    }, [statusFilter, currentPage]);

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleStatusChange = (e) => setStatusFilter(e.target.value);
    const handlePageChange = (event, value) => setCurrentPage(value);

    const handleUpdate = (id) => {
        navigate(`/admin/edit-ad/${id}`);
    }

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this ad?");
        if (!isConfirmed) return;

        try {
            const response = await fetch(`${BASE_URL}/add/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-type': 'application/json',
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong!");
            }

            Swal.fire({
                title: 'Deleted!',
                text: data.message || "Ad deleted successfully!",
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setAds((prevAds) => prevAds.filter(ad => ad._id !== id));
            fetchAds();
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Something went wrong.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    if (!["admin", "editor"].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }


    const visibleAds = ["admin", "editor"].includes(adminRole?.toLowerCase()) ? ads : [];


    return (
        <Container>
            {/* <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
                <FormControl style={{ minWidth: '100px' }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={statusFilter} label="Status" onChange={handleStatusChange}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                </FormControl>

            </Box> */}

            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>No</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Business Name</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Title</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Link</TableCell>

                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Created By</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Created Date</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {visibleAds.map((ad, index) => (
                                    <TableRow key={ad._id}>
                                        <TableCell align='center'>{(currentPage - 1) * 10 + index + 1}</TableCell>
                                        <TableCell align='center'>{ad.businessName}</TableCell>
                                        <TableCell align='center'>{ad.title}</TableCell>
                                        <TableCell align='center'>
                                            <a href={ad.link} target="_blank" rel="noopener noreferrer">View</a>
                                        </TableCell>

                                        <TableCell align='center'>{ad.createdBy?.name || ""}</TableCell>
                                        <TableCell align='center'>{new Date(ad.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell align='center'>
                                            <Button onClick={() => handleUpdate(ad._id)} variant="outlined" color="primary" size="small">Edit</Button>
                                            <Button onClick={() => handleDelete(ad._id)} variant="outlined" color="secondary" size="small" style={{ marginLeft: '8px' }}>Delete</Button>
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

export default AdsCatalog;
