import React, { useContext, useState } from 'react';
import {
    TextField, Button, Card, CardContent, Grid, Typography, Box
} from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
import AccessDenied from '../../Error/AccessDenied.jsx';
import Swal from 'sweetalert2';

const AdAddPage = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { adminRole } = useContext(MainContext);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const [adData, setAdData] = useState({
        businessName: "",
        title: "",
        link: "",
        description: "",
        address: "",
        image: null,
    });


    if (adminRole?.toLowerCase() !== "admin") {
        return (
            <AccessDenied />
        );
    }

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setAdData({ ...adData, image: file });
            setImagePreview(URL.createObjectURL(file));
        } else {
            setAdData({ ...adData, [name]: value });
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

        if (!adData.businessName || !adData.title || !adData.link || !adData.description || !adData.address || !adData.image) {
            return Swal.fire({
                title: 'Error!',
                text: 'Please fill in all fields including image.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }

        const formData = new FormData();
        formData.append('businessName', adData.businessName);
        formData.append('title', adData.title);
        formData.append('link', adData.link);
        formData.append('description', adData.description);
        formData.append('address', adData.address);
        formData.append('images', adData.image);
        console.log(formData);

        try {
            const response = await fetch(`${BASE_URL}/add/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                },
                body: formData
            });

            if (response.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Ad added successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

                setAdData({
                    businessName: "",
                    title: "",
                    link: "",
                    description: "",
                    address: "",
                    image: null,
                });
                setImagePreview(null);
            } else {
                const errorMessage = await response.text();
                console.error('Failed to add ad:', errorMessage);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to add ad',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('An error occurred:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Internal Server Error',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleDiscard = () => {
        navigate('/admin/dashboard');
    };

    const handleImageDelete = () => {
        setAdData({ ...adData, image: null });
        setImagePreview(null);
    };

    if (!["admin", "editor", "publisher"].includes(adminRole?.toLowerCase())) {
        return <AccessDenied />;
    }

    return (
        <Box sx={{ padding: 4 }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    {/* Ad Info */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5">Ad Details</Typography>
                                <TextField label="Business Name" name="businessName" value={adData.businessName} onChange={handleChange} fullWidth margin="normal" />
                                <TextField label="Title" name="title" value={adData.title} onChange={handleChange} fullWidth margin="normal" />
                                <TextField label="Link (URL)" name="link" value={adData.link} onChange={handleChange} fullWidth margin="normal" />
                                <TextField label="Description" name="description" value={adData.description} onChange={handleChange} fullWidth multiline rows={3} margin="normal" />
                                <TextField label="Address" name="address" value={adData.address} onChange={handleChange} fullWidth margin="normal" />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            mt: { xs: 0, md: 12 }
                        }}
                    >

                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>Ad Image</Typography>
                                <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
                                    Upload Image
                                    <input type="file" name="image" hidden onChange={handleChange} />
                                </Button>
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
                                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
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


                    {/* Buttons */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <Button onClick={handleDiscard} variant="outlined" color="error">Discard</Button>
                            <Button type="submit" variant="contained" color="primary">Add Ad</Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default AdAddPage;
