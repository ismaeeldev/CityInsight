import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, Card, CardContent, Grid, Typography, MenuItem, Switch, Box } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { MainContext } from '../../context/index.jsx';
import { useNavigate, useParams } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx';
import Swal from 'sweetalert2'


const ProductEditPage = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { categories, adminRole } = useContext(MainContext);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [productData, setProductData] = useState({
        title: "",
        content: "",
        image: null,
        tag: "",
        category: "",
        featured: false,
    });

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const adminToken = getCookie("adminToken");



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


    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await fetch(`${BASE_URL}/posts/${id}`, {
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();

                    // Assuming `tags` and `images` are arrays and you want the first tag and the first image
                    const firstTag = data.tags && data.tags.length > 0 ? data.tags[0] : "";
                    const firstImage = data.images && data.images.length > 0 ? `${data.images[0]}` : null;

                    setProductData({
                        title: data.title || "",
                        content: data.content || "",
                        image: firstImage,  // Set the first image link here
                        tag: firstTag,      // Set the first tag here
                        category: data.category?._id || "",
                        featured: data.featured || false,
                    });

                    if (firstImage) {
                        setImagePreview(firstImage);
                    }
                } else {
                    console.error('Failed to fetch post details');
                }
            } catch (error) {
                console.error('Error fetching post details:', error);
            }
        };


        if (id) {
            fetchDetail();
        }
    }, [id, BASE_URL]);





    const handleSubmit = async (e) => {
        e.preventDefault();

        const isConfirmed = window.confirm("Are you sure you want to update this post?");
        if (!isConfirmed) return;

        const formData = new FormData();

        // Append fields
        formData.append("title", productData.title);
        formData.append("content", productData.content);
        formData.append("category", productData.category);
        formData.append("featured", productData.featured);
        formData.append("tags", productData.tag); // Single tag as string

        // Append image only if it's a File
        if (productData.image instanceof File) {
            formData.append("images", productData.image);
        }

        try {
            const response = await fetch(`${BASE_URL}/posts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,

                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Post updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });


                setProductData({
                    title: "",
                    content: "",
                    image: null,
                    tag: '',
                    category: "",
                    featured: false
                });
                setImagePreview(null);
                navigate('/admin/all-post')
            } else {
                console.error(result);
                Swal.fire({
                    title: 'Update Failed!',
                    text: result.message || 'Unknown error',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An error occurred while updating the post.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
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
                                <Typography variant="h6">General Information</Typography>
                                <TextField label="Product Name" name="title" value={productData.title} onChange={handleChange} fullWidth margin="normal" />
                                <TextField label="content" name="content" value={productData.content} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Product Media and Category */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Product Media</Typography>
                                <Button variant="outlined" component="label" fullWidth>
                                    Upload Image
                                    <input type="file" name="image" hidden onChange={handleChange} />
                                </Button>

                                {/* Reserved Space for Image Preview */}
                                <div style={{
                                    marginTop: '10px',
                                    width: '20%',
                                    height: '20%',
                                    borderRadius: '8px',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    // border: imagePreview ? 'none' : '2px dashed #ccc'
                                }}>
                                    {imagePreview && (
                                        <>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{ width: '100%', height: '100%', borderRadius: '8px' }}
                                            />
                                            <IconTrash
                                                stroke={2}
                                                onClick={handleImageDelete}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-10px',
                                                    right: '-10px',
                                                    cursor: 'pointer',
                                                    backgroundColor: 'white',
                                                    borderRadius: '50%',
                                                    padding: '2px'
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>



                        <Card sx={{ mt: 2 }}>
                            <CardContent>
                                <Typography variant="h6">Category</Typography>
                                <TextField
                                    select
                                    name="category"
                                    value={productData.category}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                >
                                    {categories && categories.map(category => (
                                        <MenuItem key={category._id} value={category._id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Related tags
                                </Typography>
                                <TextField

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
                            <Button variant="contained" color="warning" type="submit">Update Product</Button>
                        </div>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default ProductEditPage;
