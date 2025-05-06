import React, { useContext, useState, useEffect } from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Button, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx';
import Swal from 'sweetalert2'


let searchTimeout;

const ProductDashboard = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCategory, setSortCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const { categories, adminRole, adminName } = useContext(MainContext);
    const [isFeatured, setFeatured] = useState(false);
    const [authorSearch, setAuthorSearch] = useState('');
    const navigate = useNavigate();


    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const adminToken = getCookie("adminToken");

    const fetchPosts = async () => {
        setLoading(true);

        try {
            const category = sortCategory === 'All' ? '' : sortCategory;
            const title = searchTerm || '';
            const author = authorSearch || '';
            const featured = isFeatured ? 'true' : '';

            const response = await fetch(`${BASE_URL}/posts?category=${category}&page=${currentPage}&title=${title}&featured=${featured}&author=${author}`);
            const data = await response.json();
            if (data.success) {
                setProducts(data.posts);
                setTotalPages(data.totalPages);

            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchPosts();
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchTerm, authorSearch]);

    useEffect(() => {
        fetchPosts();
    }, [sortCategory, currentPage, isFeatured]);

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleAuthor = (e) => setAuthorSearch(e.target.value);
    const handleCategoryChange = (e) => setSortCategory(e.target.value);
    const handlePageChange = (event, value) => setCurrentPage(value);

    const handleUpdate = (id) => {
        navigate(`/admin/edit-product/${id}`);
    }

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this product?");

        if (!isConfirmed) return;

        try {
            const response = await fetch(`${BASE_URL}/posts/${id}`, {
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
                text: data.message || "Product deleted successfully!",
                icon: 'success',
                confirmButtonText: 'OK'
            });


            // After successful deletion, update local state (if needed)
            setProducts((prevProducts) => prevProducts.filter(product => product._id !== id));

            // Optionally re-fetch products if you still need to fetch from the server
            fetchPosts();
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Something went wrong.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

    };


    if (!["admin", "editor", "publisher"].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }

    const visibleProducts = adminRole?.toLowerCase() === "publisher"
        ? products.filter(product => product.author.name === adminName)
        : products;


    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    my: 4,
                    gap: 2,
                }} >
                <FormControl style={{ minWidth: '100px' }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={sortCategory} label="Category" onChange={handleCategoryChange}>
                        <MenuItem value="All">All</MenuItem>
                        {categories && categories.length > 0 ? (
                            categories
                                .filter(category => category)
                                .map(category => (
                                    <MenuItem key={category._id} value={category.name}>
                                        {category.name}
                                    </MenuItem>
                                ))
                        ) : (
                            <MenuItem disabled>No Categories Available</MenuItem>
                        )}
                    </Select>

                </FormControl>

                <TextField
                    label="Search by name"
                    value={searchTerm}
                    onChange={handleSearch}
                    variant="outlined"
                    style={{ minWidth: '300px' }}
                />


                <FormControl style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
                    <TextField
                        label="Search by Author"
                        value={authorSearch}
                        onChange={handleAuthor}
                        variant="outlined"
                        size="small"
                    />


                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isFeatured}
                                onChange={(e) => setFeatured(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Featured"
                    />
                </FormControl>


            </Box>

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
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Title</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Category</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Featured</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Likes</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Views</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold' }}>Author</TableCell>
                                    <TableCell align='center' style={{ fontWeight: 'bold', paddingLeft: '20px' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {visibleProducts.map((product, index) => (
                                    <TableRow key={product.id}>
                                        <TableCell align='center'>{(currentPage - 1) * products.length + index + 1}</TableCell>
                                        <TableCell align="center">
                                            {product.title
                                                .split(' ')
                                                .slice(0, 5) 
                                                .join(' ') 
                                                .concat('...')} 
                                        </TableCell>

                                        <TableCell align='center'>{product.category?.name}</TableCell>
                                        <TableCell align='center'>{product.featured ? "Yes" : "No"}</TableCell>
                                        <TableCell align='center'>{product.likes}</TableCell>
                                        <TableCell align='center'>{product.views}</TableCell>
                                        <TableCell align='center'>{product.author?.name}</TableCell>
                                        {/* <TableCell align='center'>{product.averageRating}</TableCell> */}
                                        <TableCell align='center'>
                                            <Button onClick={() => { handleUpdate(product._id) }} variant="outlined" color="primary" size="small" style={{ border: "2px solid", borderRadius: '8px' }}>Edit</Button>
                                            <Button
                                                disabled={adminRole?.toLowerCase() === "editor"}
                                                onClick={() => handleDelete(product._id)}
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

export default ProductDashboard;
