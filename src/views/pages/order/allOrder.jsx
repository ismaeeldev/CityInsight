import React, { useContext, useState, useEffect } from 'react';
import {
    TextField, MenuItem, Select, FormControl, InputLabel, Container, Box,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Pagination, Button, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, Modal, Grid, Typography, Divider,
} from '@mui/material';
import { MainContext } from '../../context/index.jsx';
import { useNavigate } from 'react-router';
// import { set } from 'mongoose';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentsIcon from '@mui/icons-material/Payments';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Swal from 'sweetalert2'


const OrderDashboard = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const { adminRole } = useContext(MainContext);
    const navigate = useNavigate();

    const [openViewModal, setViewModal] = useState(false);
    const [openEditModal, setEditModal] = useState(false);
    const [editOrder, setEditOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [isEmpty, setIsEmpty] = useState(false);
    const [products, setProducts] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [viewData, setViewData] = useState({});


    const handleView = (order) => {
        setViewData(order);
        setViewModal(true);
    }

    useEffect(() => {
        fetchOrders();
    }, [searchTerm, paymentStatus, orderStatus, year, month, currentPage]);

    const fetchOrders = async () => {
        setLoading(true);
        setIsEmpty(false);

        try {
            const response = await fetch(
                `${BASE_URL}/order/fetch?paymentStatus=${paymentStatus}&status=${orderStatus}&year=${year}&month=${month}&page=${currentPage}&search=${searchTerm}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success || !data.orders.length) {
                setOrders([]);
                setTotalPages(1);
                setIsEmpty(true);
            } else {
                setOrders(data.orders);
                setTotalPages(Math.ceil(data.totalOrders / data.limit));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
            setIsEmpty(true);
        } finally {
            // ✅ Ensure loading stops, even if API is slow
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    };

    const handleEdit = (order) => {
        setEditOrder(order);
        setEditModal(true);
    };


    const handleUpdateOrder = async () => {
        try {
            const orderData = {
                orderId: editOrder.orderId,
                paymentStatus: editOrder.paymentStatus,
                orderStatus: editOrder.orderStatus,
            };

            const response = await fetch(`${BASE_URL}/order/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "")
                setEditModal(false);
                fetchOrders();
            } else {
                console.error('Error updating order status:', data.message);
                alert(data.message || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('There was a problem with the request');
        }
    };
    return (
        <Container>
            <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
                <Box display="flex" gap={1}>
                    <FormControl style={{ minWidth: '100px' }}>
                        <InputLabel>Payment</InputLabel>
                        <Select label="Payment" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="paid">Paid</MenuItem>
                            <MenuItem value="unpaid">Unpaid</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl style={{ minWidth: '100px' }}>
                        <InputLabel>Status</InputLabel>
                        <Select label="Status" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <TextField
                    label="Search by Order ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outlined"
                    style={{ minWidth: '300px' }}
                />

                <Box display="flex" gap={1}>
                    <FormControl style={{ minWidth: '100px' }}>
                        <InputLabel>Month</InputLabel>
                        <Select label="Month" value={month} onChange={(e) => setMonth(e.target.value)}>
                            <MenuItem value="">All</MenuItem>
                            {Array.from({ length: 12 }, (_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl style={{ minWidth: '100px' }} fullWidth>
                        <InputLabel htmlFor="year-select">Year</InputLabel>
                        <Select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            label="Year"
                            inputProps={{ id: 'year-select' }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {Array.from({ length: 10 }, (_, i) => {
                                const currentYear = new Date().getFullYear();
                                const yearValue = currentYear - i;
                                return (
                                    <MenuItem key={yearValue} value={yearValue}>
                                        {yearValue}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>


                </Box>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : isEmpty ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <h4>No data available</h4>
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow >
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Order ID</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Customer Name</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Email</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Amount</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Status</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Payment</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Date</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }} align="center">Actions</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell align="center">{order._id}</TableCell>
                                        <TableCell align="center" sx={{ textAlign: 'center' }}>{order.userId?.name}</TableCell>
                                        <TableCell align="center">{order.userId?.email}</TableCell>
                                        <TableCell align="center">${order.totalAmount}</TableCell>
                                        <TableCell align="center">
                                            <span style={{
                                                backgroundColor: order.orderStatus === "completed" ? "green" :
                                                    order.orderStatus === "pending" ? "orange" :
                                                        order.orderStatus === "cancelled" ? "red" : "transparent",
                                                color: "white",
                                                borderRadius: "4px",
                                                padding: "2px 6px",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                display: "inline-block",
                                                minWidth: "70px",
                                                textAlign: "center"
                                            }}>
                                                {order.orderStatus}
                                            </span>
                                        </TableCell>

                                        <TableCell align="center">
                                            <span style={{
                                                backgroundColor: order.paymentStatus === "paid" ? "green" :
                                                    order.paymentStatus === "unpaid" ? "red" : "transparent",
                                                color: "white",
                                                borderRadius: "4px",
                                                padding: "2px 6px",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                display: "inline-block",
                                                minWidth: "60px",
                                                textAlign: "center"
                                            }}>
                                                {order.paymentStatus}
                                            </span>
                                        </TableCell>

                                        <TableCell align="center">{new Date(order.createdAt).toLocaleDateString()}</TableCell>

                                        <TableCell>
                                            <Button onClick={() => { handleView(order) }} variant="outlined" color="primary" size="small" style={{ border: "2px solid", borderRadius: '8px' }}>
                                                View
                                            </Button>
                                            <Button

                                                disabled={adminRole?.toLowerCase() === "editor"}
                                                variant="outlined"
                                                color="secondary"
                                                size="small"
                                                style={{ marginLeft: '8px', border: "2px solid", borderRadius: '8px' }}
                                                onClick={() => { handleEdit({ orderId: order._id, orderStatus: order.orderStatus, paymentStatus: order.paymentStatus }) }}

                                            >
                                                Edit
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
                            onChange={(e, value) => setCurrentPage(value)}
                            color="primary"
                        />
                    </Box>
                </>
            )}

            <Dialog
                open={openEditModal}
                onClose={() => setEditModal(false)}
                maxWidth="sm"
                fullWidth
                sx={{ "& .MuiDialog-paper": { width: "500px", minHeight: "250px" } }}
            >
                <DialogTitle>Edit Order Status</DialogTitle>
                <DialogContent
                    sx={{
                        minHeight: "150px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 2,
                    }}
                >
                    {/* Order Status Dropdown */}
                    <FormControl fullWidth>
                        <InputLabel>Order Status</InputLabel>
                        <Select
                            label='Order Status'
                            value={editOrder?.orderStatus || ""}
                            onChange={(e) => setEditOrder({ ...editOrder, orderStatus: e.target.value })}
                        >
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Payment Status Dropdown */}
                    <FormControl fullWidth>
                        <InputLabel>Payment Status</InputLabel>
                        <Select
                            label='Payment Status'
                            value={editOrder?.paymentStatus || ""}
                            onChange={(e) => setEditOrder({ ...editOrder, paymentStatus: e.target.value })}
                        >
                            <MenuItem value="paid">Paid</MenuItem>
                            <MenuItem value="unpaid">Unpaid</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setEditModal(false)} sx={{ color: "red" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateOrder} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>


            <Modal open={openViewModal} onClose={() => setViewModal(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 600,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 3,
                        overflowY: 'auto',
                        maxHeight: '90vh',
                    }}
                >
                    <Grid container spacing={3}>
                        {/* Title Section */}
                        <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                            <Typography variant="h2" fontWeight={900}>
                                Order Details
                            </Typography>

                        </Grid>

                        {/* User Info and Order Summary */}
                        <Grid item xs={12} sm={6}>
                            {/* Customer Name */}
                            <Typography fontWeight={900} display="flex" alignItems="center" gap={1} fontSize={16}>
                                <PersonIcon color="black" />
                                {viewData.userId?.name || 'N/A'}
                            </Typography>

                            {/* Order + Payment Status */}
                            <Typography display="flex" alignItems="center" gap={1} fontSize={16} mt={1}>
                                <ReceiptLongIcon color="black" />
                                {viewData.orderStatus || 'Pending'} - {viewData.paymentStatus || 'Unpaid'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} textAlign="right">
                            {/* Total Amount */}
                            <Typography fontWeight={900} display="flex" justifyContent="flex-end" alignItems="center" gap={1} fontSize={16}>
                                <PaymentsIcon color="black" />
                                ${viewData.totalAmount || '0.00'}
                            </Typography>

                            {/* Created At */}
                            <Typography display="flex" justifyContent="flex-end" alignItems="center" gap={1} fontSize={16} mt={1}>
                                <CalendarTodayIcon color="black" />
                                {viewData.createdAt ? new Date(viewData.createdAt).toLocaleDateString() : ''}
                            </Typography>
                        </Grid>


                        {/* Divider */}
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        {/* Product List */}
                        <Grid item xs={12}>
                            <Typography style={{ textAlign: 'center' }} variant="h3" gutterBottom>
                                Products
                            </Typography>
                            {viewData.products?.map((product, index) => (
                                <Paper
                                    key={index}
                                    elevation={2}
                                    sx={{ padding: 2, borderRadius: 2, mb: 1.5, backgroundColor: '#f9f9f9' }}
                                >
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={8}>
                                            <Typography variant="body1" fontWeight={500}>
                                                {product.productId?.title || 'Untitled Product'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} textAlign="right">
                                            <Typography variant="body2">Qty: {product.quantity || 0}</Typography>
                                            <Typography variant="body2">
                                                ${product.productId?.price?.toFixed(2) || '0.00'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Grid>

                        {/* Close Button */}
                        <Grid item xs={12} textAlign="right">
                            <button
                                onClick={() => setViewModal(false)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#fe0000',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                }}
                            >
                                Close
                            </button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>



        </Container>
    );
}

export default OrderDashboard;
