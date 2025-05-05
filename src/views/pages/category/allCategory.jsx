import React, { useContext, useState, useEffect } from 'react';
import {
    Container, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Pagination
} from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import { Description } from '@mui/icons-material';
import AccessDenied from '../../Error/AccessDenied.jsx';
import Swal from 'sweetalert2'


const AllCategories = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { categories, adminRole, fetchCategories } = useContext(MainContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState({
        name: "",
        description: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 10;
    const [categoryDescription, setCategoryDescription] = useState("");


    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const adminToken = getCookie("adminToken");

    useEffect(() => {
        fetchCategories();
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const totalPages = Math.ceil(categories.length / categoriesPerPage);
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const visibleCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };


    const handleAddCategory = async () => {
        if (!newCategory) return Swal.fire({
            title: 'Error!',
            text: 'Category name is required.',
            icon: 'error',
            confirmButtonText: 'OK'
        });

        try {
            const response = await fetch(`${BASE_URL}/categories/add-category`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newCategory,
                    description: categoryDescription,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Error adding category");

            Swal.fire({
                title: 'Success!',
                text: 'Category added successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setNewCategory("");
            setCategoryDescription("");
            setOpenModal(false);
            fetchCategories();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            const response = await fetch(`${BASE_URL}/categories/delete-category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Error deleting category");
            Swal.fire({
                title: 'Deleted!',
                text: 'Category deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            fetchCategories();
        } catch (error) {
            alert(`Error: ${error.message}`);
            fetchCategories();
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setOpenEditModal(true);
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory?.name) return Swal.fire({
            title: 'Error!',
            text: 'Category name is required.',
            icon: 'error',
            confirmButtonText: 'OK'
        });


        try {
            const response = await fetch(`${BASE_URL}/categories/update-category/${editingCategory._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: editingCategory.name,
                    description: editingCategory.description,
                }),
            });

            // Check if the response is ok (status 200-299)
            if (!response.ok) {
                const errorText = await response.text(); // Read response as text
                console.error('Error Response:', errorText); // Log the response text for debugging
                throw new Error(errorText || "Error updating category");
            }

            // Attempt to parse the response as JSON
            const data = await response.json();

            // Check if the response contains success message or any required data
            if (data?.message) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Category updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                setOpenEditModal(false);
                fetchCategories(); // Refresh categories
            } else {
                throw new Error("Unexpected response format.");
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    if (!["admin", "editor"].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }



    return (
        <Container>
            <Box display="flex" justifyContent="space-between" my={4}>
                <Button variant="contained" color="error" onClick={() => navigate('/admin/dashboard')}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                    Add Category
                </Button>
            </Box>


            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : categories.length === 0 ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <p>No categories found</p>
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
                                            pl: 20
                                        }
                                    }}
                                >
                                    Category Name
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }} align="right" sx={{ pr: 18 }}>Actions</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleCategories.map((category, index) => (

                                <TableRow key={category._id}>
                                    <TableCell sx={{
                                        "@media (min-width: 1024px)": {
                                            pl: 5
                                        }
                                    }} align="left">{indexOfFirstCategory + index + 1}</TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            "@media (min-width: 1024px)": {
                                                pl: 20,
                                            }
                                        }}
                                    >
                                        {category.name}
                                    </TableCell>
                                    <TableCell sx={{ pr: 12 }} align="right">
                                        <Button
                                            onClick={() => handleEdit(category)}
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
                                            disabled={adminRole?.toLowerCase() !== "admin"}

                                            onClick={() => handleDelete(category._id)}
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

            {/* Add Category Modal */}
            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                maxWidth="sm"
                fullWidth
                sx={{ "& .MuiDialog-paper": { width: "500px", minHeight: "400px" } }}
            >
                <DialogTitle>Add New Category</DialogTitle>
                <DialogContent
                    sx={{
                        minHeight: "200px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 2,
                    }}
                >
                    <TextField
                        autoFocus
                        label="Category Name"
                        fullWidth
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth
                        value={categoryDescription}
                        onChange={(e) => { setCategoryDescription(e.target.value) }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleAddCategory} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>



            {/* Edit Category Modal */}
            <Dialog
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                maxWidth="sm"
                fullWidth
                sx={{ "& .MuiDialog-paper": { width: "500px", minHeight: "400px" } }}
            >
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent
                    sx={{
                        minHeight: "150px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 2,
                    }}
                >
                    <TextField
                        autoFocus
                        label="Category Name"
                        fullWidth
                        value={editingCategory?.name || ""}
                        onChange={(e) =>
                            setEditingCategory((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth
                        value={editingCategory?.description || ""}
                        onChange={(e) =>
                            setEditingCategory((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenEditModal(false)} sx={{ color: "red" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateCategory} color="primary">
                        Update
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

export default AllCategories;
