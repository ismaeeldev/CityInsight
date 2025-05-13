import React, { useContext, useState, useEffect } from 'react';
import {
    Container, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Pagination, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx'
import { Chip } from '@mui/material';
import Swal from 'sweetalert2'



const AllPermission = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { adminRole } = useContext(MainContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [Newloading, setNewLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editRole, setEditRole] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [allPermission, setAllPermission] = useState([])
    const permissionPerPage = 10;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const adminToken = getCookie("adminToken");

    if (adminRole?.toLowerCase() !== "admin") {
        return (
            <AccessDenied />
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchPermission();
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const totalPages = Math.ceil(allPermission.length / permissionPerPage);
    const indexOfLastPermission = currentPage * permissionPerPage;
    const indexOfFirstPermission = indexOfLastPermission - permissionPerPage;
    const visiblePermission = allPermission.slice(indexOfFirstPermission, indexOfLastPermission);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };


    const handleAddRole = async () => {
        const { name, email, password, role } = formData;

        // Proper validation
        if (!name || !email || !password || !role) {
            return Swal.fire({
                title: 'Error!',
                text: 'All fields are required!',
                icon: 'error',
                confirmButtonText: 'OK'
            });

        }

        setNewLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/admin/create-user`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error adding role");

            Swal.fire({
                title: 'Success!',
                text: 'Role added successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });


            setOpenModal(false);
            setFormData({ name: '', email: '', password: '', role: '' });
            fetchPermission();
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setNewLoading(false);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Role?")) return;

        try {
            const response = await fetch(`${BASE_URL}/admin/delete-user/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },

            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Error deleting Role");

            Swal.fire({
                title: 'Deleted!',
                text: 'Role deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            fetchPermission();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };


    const handleEdit = (email, role, id) => {
        setEditRole({ email, role, id });
        setOpenEditModal(true);
    };



    const handleEditRole = async () => {
        if (!editRole?.email || !editRole?.role) {
            return Swal.fire({
                title: 'Error!',
                text: 'Email or role is missing. Please reload and try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });

        }

        setNewLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/admin/change-role/${editRole.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    role: editRole.role
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error updating role");

            Swal.fire({
                title: 'Success!',
                text: 'Role updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setOpenEditModal(false);
            setEditRole(null);
            fetchPermission();
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setNewLoading(false)
        }
    };



    const fetchPermission = async () => {

        try {
            const response = await fetch(`${BASE_URL}/admin/management-roles`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Error fetching permission");
            }
            setAllPermission(data.users);
        }
        catch (error) {
            alert(`Error : ${error.message}`);
        }

    }

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" my={4}>
                <Button variant="contained" color="error" onClick={() => navigate('/admin/dashboard')}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                    Add Role
                </Button>
            </Box>


            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : allPermission.length === 0 ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <p>No Permission found</p>
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }} sx={{
                                    "@media (min-width: 1024px)": {
                                        pl: 5
                                    }
                                }} align="left">No</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"
                                    sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 10
                                        }
                                    }}
                                >
                                    Name
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"
                                    sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 10
                                        }
                                    }}
                                >
                                    Email
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}
                                    align="center"
                                    sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 10
                                        }
                                    }}
                                >
                                    Role
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }} align="right" sx={{ pr: 18 }}>Actions</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visiblePermission.map((admin, index) => (

                                <TableRow key={admin._id}>
                                    <TableCell sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 5
                                        }
                                    }} align="left">{indexOfFirstPermission + index + 1}</TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            "@media (min-width: 1024px)": {
                                                pl: 10,
                                            }
                                        }}
                                    >
                                        {admin.name || ''}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            "@media (min-width: 1024px)": {
                                                pl: 10,
                                            }
                                        }}
                                    >
                                        {admin.email}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            "@media (min-width: 1024px)": {
                                                pl: 10,
                                            },
                                        }}
                                    >
                                        {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                                        {admin?.email === 'adminroman@gmail.com' && (
                                            <Chip
                                                label="Root"
                                                color="error"
                                                size="small"
                                                sx={{ ml: 1, fontWeight: 'bold' }}
                                            />
                                        )}

                                    </TableCell>
                                    <TableCell sx={{ pr: 12 }} align="right">
                                        <Button
                                            disabled={adminRole?.toLowerCase() !== "admin"}
                                            onClick={() => { handleEdit(admin.email, admin.role, admin._id) }}
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            style={{
                                                border: "2px solid", borderRadius: '8px'
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            disabled={
                                                adminRole?.toLowerCase() !== "admin" || admin?.email === "adminroman@gmail.com"
                                            }

                                            onClick={() => handleDelete(admin._id)}
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            style={{ marginLeft: '8px', border: "2px solid", borderRadius: '8px' }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                maxWidth="sm"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        width: "500px",
                        borderRadius: 3,
                        padding: 2,
                    }
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>
                    Add New Permission
                </DialogTitle>

                <DialogContent>
                    <Box
                        component="form"
                        noValidate
                        autoComplete="off"
                        sx={{ display: 'grid', gap: 2, mt: 1 }}
                    >
                        <TextField
                            name="name"
                            label="Name"
                            fullWidth
                            variant="outlined"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            name="email"
                            label="Email"
                            fullWidth
                            variant="outlined"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                name="role"
                                value={formData.role}
                                label="Role"
                                onChange={handleChange}
                            >
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="editor">Editor</MenuItem>
                                <MenuItem value="publisher">Publisher</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                    <Button onClick={() => setOpenModal(false)} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleAddRole} color="primary" variant="contained">
                        {Newloading ? <CircularProgress size={24} color="inherit" /> : 'Add'}

                    </Button>
                </DialogActions>
            </Dialog>



            {/* Edit Role Modal */}
            <Dialog
                open={openEditModal}
                onClose={() => handleEditRole(false)}
                maxWidth="sm"
                fullWidth
                sx={{ "& .MuiDialog-paper": { width: "500px", minHeight: "250px" } }}
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>Edit Role</DialogTitle>

                <DialogContent
                    sx={{
                        minHeight: "150px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 2,
                    }}
                >
                    {/* Email Field (Disabled) */}
                    <TextField
                        label="Email"
                        value={editRole?.email || ""}
                        disabled
                        fullWidth
                    />

                    {/* Role Dropdown */}
                    <FormControl fullWidth>
                        <InputLabel id="role-select-label">Select Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            id="role-select"
                            value={editRole?.role || ""}
                            label="Select Role"
                            onChange={(e) => setEditRole({ ...editRole, role: e.target.value })}
                        >
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="editor">Editor</MenuItem>
                            <MenuItem value="publisher">Publisher</MenuItem>
                            {/* Add more roles as needed */}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenEditModal(false)} sx={{ color: "red" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleEditRole} color="primary">
                        {Newloading ? <CircularProgress size={24} color="inherit" /> : 'Update'}

                    </Button>
                </DialogActions>
            </Dialog>




            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>

        </Container>
    );
};

export default AllPermission;
