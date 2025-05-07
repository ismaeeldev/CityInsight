import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Card, CardContent, Grid, Typography, MenuItem, Switch, Box } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx';
import Swal from 'sweetalert2'
import CircularProgress from '@mui/material/CircularProgress';


const ProductAddPage = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { categories, fetchCategories, adminRole } = useContext(MainContext);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState({
        title: "",
        content: "",
        image: null,
        tag: "",
        category: "",
        featured: false,
    });

    useEffect(() => {
        // console.log(adminRole)
        fetchCategories();
    })


    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setProductData({ ...productData, image: file });
            setImagePreview(URL.createObjectURL(file));
        } else if (type === 'checkbox') {
            setProductData({ ...productData, [name]: checked });
        } else {
            setProductData({ ...productData, [name]: value });
        }
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const adminToken = getCookie("adminToken");


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productData.category) {
            return Swal.fire({
                title: 'Error!',
                text: 'Select Category',
                icon: 'error',
                confirmButtonText: 'OK'
            });

        }
        setLoading(true);

        const formData = new FormData();

        // Append all other fields
        formData.append('title', productData.title);
        formData.append('content', productData.content);
        formData.append('category', productData.category);
        formData.append('tags', productData.tag);
        formData.append('featured', productData.featured);

        // Append image(s)
        if (productData.image) {
            formData.append('images', productData.image); // backend expects 'images' array
        }

        try {
            const response = await fetch(`${BASE_URL}/posts/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    // Don't set Content-Type when sending FormData
                },
                body: formData
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Post added successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                setProductData({
                    title: "",
                    content: "",
                    image: null,
                    tag: "",
                    category: "",
                    featured: false,
                });
                setImagePreview(null);
            } else {
                const errorMessage = await response.text();
                console.error('Failed to add Post:', errorMessage);
                Swal.fire({
                    title: 'Error!',
                    text: 'Faild to add post',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });

            }
        } catch (error) {
            console.error('An error occurred:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Internal Server Error ',
                icon: 'error',
                confirmButtonText: 'OK'
            });

        } finally {
            setLoading(false);
        }
    };


    const handleImageDelete = () => {
        setProductData({ ...productData, image: null });
        setImagePreview(null);
    };

    const handleDiscard = () => {
        navigate('/admin/dashboard');
    }

    if (!["admin", "editor", "publisher"].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    {/* General Information */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">Post Detail</Typography>
                                <TextField label="Post title" name="title" value={productData.title} onChange={handleChange} fullWidth margin="normal" />
                                <TextField label="Content" name="content" value={productData.content} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Product Media and Category */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Post Media
                                </Typography>

                                {/* Upload Button */}
                                <Button variant="outlined" component="label" fullWidth sx={{ mb: 4 }}>
                                    Upload Image
                                    <input type="file" name="image" hidden onChange={handleChange} />
                                </Button>

                                {/* Centered Preview Box */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 200,
                                            height: 140,
                                            border: '2px dashed #ccc',
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            backgroundColor: '#f9f9f9',
                                        }}
                                    >
                                        {imagePreview ? (
                                            <>
                                                <Box
                                                    component="img"
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <IconTrash
                                                    stroke={2}
                                                    onClick={handleImageDelete}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        cursor: 'pointer',
                                                        backgroundColor: 'white',
                                                        borderRadius: '50%',
                                                        padding: '4px',
                                                        boxShadow: '0 0 4px rgba(0,0,0,0.2)',
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <Typography color="textSecondary" sx={{ textAlign: 'center', px: 2 }}>
                                                Image preview will appear here
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Category
                                </Typography>
                                <TextField
                                    select
                                    name="category"
                                    value={productData.category}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                >
                                    {categories && categories.map((category) => (
                                        <MenuItem key={category._id} value={category._id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Stock */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Related tags
                                </Typography>
                                <TextField
                                    label="tag"
                                    name="tag"
                                    value={productData.tag}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    type="text"
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Additional Options */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <Box
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>Additional Options</Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                                        <Typography>Featured</Typography>
                                        <Switch
                                            name="featured"
                                            checked={productData.featured}
                                            onChange={handleChange}
                                        />
                                    </Box>

                                </CardContent>
                            </Box>
                        </Card>
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                            <Button onClick={handleDiscard} variant="outlined" color="error">Discard Changes</Button>
                            <Button variant="contained" color="primary" type="submit">
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Post'}

                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default ProductAddPage;
